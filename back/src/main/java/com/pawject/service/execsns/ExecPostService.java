package com.pawject.service.execsns;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.pawject.domain.ExecHashtag;
import com.pawject.domain.ExecImage;
import com.pawject.domain.ExecPost;
import com.pawject.domain.User;
import com.pawject.dto.execsns.PostRequestDto;
import com.pawject.dto.execsns.PostResponseDto;
import com.pawject.repository.ExecHashtagRepository;
import com.pawject.repository.ExecPostRepository;
import com.pawject.repository.ExecRetweetRepository;
import com.pawject.repository.ExecUserRepository;
import com.pawject.util.UtilUpload;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ExecPostService {

    private final ExecPostRepository postRepository;
    private final ExecUserRepository userRepository;
    private final ExecHashtagRepository hashtagRepository;
    private final UtilUpload utilUpload;
    private final ExecRetweetRepository retweetRepository;

    // [신규 메서드] 이메일(+provider) 기반 글쓰기: 리뷰 방식
    public PostResponseDto createPostByEmail(String email, String provider, PostRequestDto dto, List<MultipartFile> files) {
        User user = resolveUserByEmail(email, provider);

        ExecPost post = new ExecPost();
        post.setContent(dto.getContent());
        post.setUser(user);

        if (files != null && !files.isEmpty()) {
            files.forEach(file -> {
                if (file != null && !file.isEmpty()) {
                    try {
                        String url = utilUpload.fileUpload(file, "exec");
                        ExecImage image = new ExecImage();
                        image.setSrc(url);
                        image.setPost(post);
                        post.getImages().add(image);
                    } catch (IOException e) {
                        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "이미지 업로드 실패", e);
                    }
                }
            });
        }

        if (dto.getHashtags() != null && !dto.getHashtags().isEmpty()) {
            Set<String> distinctTags = Arrays.stream(dto.getHashtags().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toSet());

            distinctTags.forEach(tagStr -> {
                String normalized = tagStr.startsWith("#") ? tagStr.substring(1) : tagStr;
                ExecHashtag tag = hashtagRepository.findByName(normalized)
                        .orElseGet(() -> {
                            ExecHashtag newTag = new ExecHashtag();
                            newTag.setName(normalized);
                            return hashtagRepository.save(newTag);
                        });
                post.getHashtags().add(tag);
            });
        }

        ExecPost saved = postRepository.save(post);

        PostResponseDto dtoResponse = PostResponseDto.from(saved);
        dtoResponse.setRetweetCount(
                retweetRepository.countByOriginalPost_Id(saved.getId())
        );
        return dtoResponse;
    }

    // [신규 메서드] provider 생략 버전 (프로젝트에서 provider를 안 쓰면 이걸로 호출)
    public PostResponseDto createPostByEmail(String email, PostRequestDto dto, List<MultipartFile> files) {
        return createPostByEmail(email, "local", dto, files);
    }

    // [기존 메서드 유지] 호환용: userId 기반
    // - 기존 호출부가 남아있어도 500 대신 401/404로 명확히 떨어지게 정리
    public PostResponseDto createPost(Long userId, PostRequestDto dto, List<MultipartFile> files) {
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "인증 정보가 없습니다.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "사용자 없음"));

        ExecPost post = new ExecPost();
        post.setContent(dto.getContent());
        post.setUser(user);

        if (files != null && !files.isEmpty()) {
            files.forEach(file -> {
                if (file != null && !file.isEmpty()) {
                    try {
                        String url = utilUpload.fileUpload(file, "exec");
                        ExecImage image = new ExecImage();
                        image.setSrc(url);
                        image.setPost(post);
                        post.getImages().add(image);
                    } catch (IOException e) {
                        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "이미지 업로드 실패", e);
                    }
                }
            });
        }

        if (dto.getHashtags() != null && !dto.getHashtags().isEmpty()) {
            Set<String> distinctTags = Arrays.stream(dto.getHashtags().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toSet());

            distinctTags.forEach(tagStr -> {
                String normalized = tagStr.startsWith("#") ? tagStr.substring(1) : tagStr;
                ExecHashtag tag = hashtagRepository.findByName(normalized)
                        .orElseGet(() -> {
                            ExecHashtag newTag = new ExecHashtag();
                            newTag.setName(normalized);
                            return hashtagRepository.save(newTag);
                        });
                post.getHashtags().add(tag);
            });
        }

        ExecPost saved = postRepository.save(post);

        PostResponseDto dtoResponse = PostResponseDto.from(saved);
        dtoResponse.setRetweetCount(
                retweetRepository.countByOriginalPost_Id(saved.getId())
        );
        return dtoResponse;
    }

    // [신규 메서드] 이메일 기반 사용자 해석 (리뷰의 selectUserIdForReview 역할)
    private User resolveUserByEmail(String email, String provider) {
        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "인증 정보가 없습니다.");
        }

        if (provider != null && !provider.isBlank()) {
            return userRepository.findByEmailAndProvider(email, provider)
                    .orElseGet(() -> userRepository.findByEmail(email)
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "사용자 없음")));
        }

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "사용자 없음"));
    }

    @Transactional(readOnly = true)
    public PostResponseDto getPost(Long postId) {
        ExecPost post = postRepository.findById(postId)
                .filter(p -> !p.isDeleted())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글 없음"));

        PostResponseDto dto = PostResponseDto.from(post);
        dto.setRetweetCount(
                retweetRepository.countByOriginalPost_Id(post.getId())
        );
        return dto;
    }

    @Transactional(readOnly = true)
    public List<PostResponseDto> getAllPosts() {
        return postRepository.findByDeletedFalse().stream()
                .map(post -> {
                    PostResponseDto dto = PostResponseDto.from(post);
                    dto.setRetweetCount(
                            retweetRepository.countByOriginalPost_Id(post.getId())
                    );
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PostResponseDto> getAllPostsPaged(int page, int size) {
        int start = (page - 1) * size + 1;
        int end = page * size;

        List<ExecPost> posts = postRepository.findPostsWithPaging(start, end);

        return posts.stream()
                .map(post -> {
                    PostResponseDto dto = PostResponseDto.from(post);
                    dto.setRetweetCount(
                            retweetRepository.countByOriginalPost_Id(post.getId())
                    );
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PostResponseDto> getLikedPostsPaged(Long userId, int page, int size) {
        int start = (page - 1) * size + 1;
        int end = page * size;

        List<ExecPost> posts = postRepository.findLikedPostsWithPaging(userId, start, end);

        return posts.stream()
                .map(post -> {
                    PostResponseDto dto = PostResponseDto.from(post);
                    dto.setRetweetCount(
                            retweetRepository.countByOriginalPost_Id(post.getId())
                    );
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PostResponseDto> getMyPostsAndRetweetsPaged(Long userId, int page, int size) {
        int start = (page - 1) * size + 1;
        int end = page * size;

        List<ExecPost> posts =
                postRepository.findMyPostsAndRetweetsWithPaging(userId, start, end);

        return posts.stream()
                .map(post -> {
                    PostResponseDto dto = PostResponseDto.from(post);
                    dto.setRetweetCount(
                            retweetRepository.countByOriginalPost_Id(post.getId())
                    );
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PostResponseDto> getPostsByHashtag(String hashtag) {
        String normalized = hashtag.startsWith("#") ? hashtag.substring(1) : hashtag;
        List<ExecPost> posts =
                postRepository.findByHashtags_NameAndDeletedFalse(normalized);

        return posts.stream()
                .map(post -> {
                    PostResponseDto dto = PostResponseDto.from(post);
                    dto.setRetweetCount(
                            retweetRepository.countByOriginalPost_Id(post.getId())
                    );
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public PostResponseDto updatePost(Long userId, Long postId, PostRequestDto dto, List<MultipartFile> files) {
        ExecPost post = postRepository.findById(postId)
                .filter(p -> !p.isDeleted())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글 없음"));

        if (!post.getUser().getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인 글만 수정할 수 있습니다.");
        }

        post.setContent(dto.getContent());

        if (files != null && !files.isEmpty()) {
            post.getImages().clear();
            files.forEach(file -> {
                if (file != null && !file.isEmpty()) {
                    try {
                        String url = utilUpload.fileUpload(file, "exec");
                        ExecImage image = new ExecImage();
                        image.setSrc(url);
                        image.setPost(post);
                        post.getImages().add(image);
                    } catch (IOException e) {
                        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "이미지 업로드 실패", e);
                    }
                }
            });
        }

        post.getHashtags().clear();
        if (dto.getHashtags() != null && !dto.getHashtags().isEmpty()) {
            Set<String> distinctTags = Arrays.stream(dto.getHashtags().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toSet());

            distinctTags.forEach(tagStr -> {
                String normalized = tagStr.startsWith("#") ? tagStr.substring(1) : tagStr;
                ExecHashtag tag = hashtagRepository.findByName(normalized)
                        .orElseGet(() -> {
                            ExecHashtag newTag = new ExecHashtag();
                            newTag.setName(normalized);
                            return hashtagRepository.save(newTag);
                        });
                post.getHashtags().add(tag);
            });
        }

        ExecPost updated = postRepository.save(post);
        PostResponseDto dtoResponse = PostResponseDto.from(updated);
        dtoResponse.setRetweetCount(
                retweetRepository.countByOriginalPost_Id(updated.getId())
        );
        return dtoResponse;
    }

    public void deletePost(Long userId, Long postId) {
        ExecPost post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글 없음"));

        if (!post.getUser().getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인 글만 삭제할 수 있습니다.");
        }

        post.setDeleted(true);
        postRepository.save(post);
    }

    @Transactional(readOnly = true)
    public long countPosts() {
        return postRepository.count();
    }
}
