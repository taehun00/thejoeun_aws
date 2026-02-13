//package com.pawject;
//
//import static org.assertj.core.api.Assertions.assertThat;
//
//import java.util.List;
//import java.util.Optional;
//import java.util.UUID;
//
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.transaction.annotation.Transactional;
//
//import com.pawject.domain.ExecHashtag;
//import com.pawject.domain.ExecImage;
//import com.pawject.domain.ExecPost;
//import com.pawject.domain.User;
//import com.pawject.repository.ExecCommentRepository;
//import com.pawject.repository.ExecFollowRepository;
//import com.pawject.repository.ExecHashtagRepository;
//import com.pawject.repository.ExecImageRepository;
//import com.pawject.repository.ExecPostLikeRepository;
//import com.pawject.repository.ExecPostRepository;
//import com.pawject.repository.ExecRetweetRepository;
//import com.pawject.repository.UserRepository;
//
// 
///**
// * Repository CRUD 통합테스트
// * 순서 : AppUser →
//*/
//@SpringBootTest
//@Transactional  // org.springframework.transaction.annotation.Transactional
//class Pawject4ApplicationTests_exec {
//
//	@Autowired private UserRepository          userRepository;
//	@Autowired private ExecPostRepository      execPostRepository;
//	@Autowired private ExecImageRepository     execImageRepository;
//	@Autowired private ExecCommentRepository   execCommentRepository;
//	@Autowired private ExecFollowRepository    execFollowRepository;
//	@Autowired private ExecHashtagRepository   execHashtagRepository;
//	@Autowired private ExecPostLikeRepository  execPostLikeRepository;
//	@Autowired private ExecRetweetRepository   execRetweetRepository;
//	
//	//테스트 공통 데이터
//	private User user1;
//	private User user2;
//	private ExecPost    execPost;
//	
//	/**
//	 * 공통 준비 : 사용자 2명 + 게시글 1글
//	*/
//	@BeforeEach
//	void setup() {
//		//사용자 생성
//		String email1 = "user1_" + UUID.randomUUID() + "@test.com";
//		String email2 = "user2_" + UUID.randomUUID() + "@test.com";
//		
//		user1 = new User();
//		user1.setEmail(email1);
//		user1.setPassword("pass123");
//		user1.setNickname("user1");
//		user1.setProvider("local");
//		//user1.setDeleted(false);
//		
//		user2 = new User();
//		user2.setEmail(email2);
//		user2.setPassword("pass123");
//		user2.setNickname("user2");
//		user2.setProvider("local");
//		//user2.setDeleted(false);
//		
//		userRepository.save(user1);
//		userRepository.save(user2);
//		//게시글 생성
//
//		execPost = new ExecPost();
//		execPost.setEcontent("테스트 게시글");
//		execPost.setUser(user1);
//		execPost.setDeleted(false);
//		execPostRepository.save(execPost);
//	}
//	
//
//	// ---------------------------------------------------------------------
//    // ImageRepository ( 이미지생성, 단건조회, 삭제후 조회 불가확인 )
//    // ---------------------------------------------------------------------
//	@Test
//	@DisplayName("■ ImageRepository-CRUD ")
//	void testImageRepository() {
//		// 이미지생성 (save)
//		ExecImage image = new ExecImage();
//		image.setExecimgsrc("1.png");
//		image.setExecPost(execPost);
//		execImageRepository.save(image);
//		
//		// 단건조회 (findById)
//		assertThat(  execImageRepository.findById( image.getId() )  ).isPresent();
//		
//		// 삭제후 조회 불가확인 (delete:객체, findById:번호)
//		execImageRepository.delete(image);
//		assertThat(  execImageRepository.findById( image.getId() )  ).isEmpty();
//		
//	}
//	
//	// ---------------------------------------------------------------------
//	// HashtagRepository - HashTag
//	// ---------------------------------------------------------------------
//		@Test
//		@DisplayName("■ PostRepository-CRUD ")
//		void testPostRepository() {
//			// 해쉬태그 연결 후 검색
//			ExecHashtag tag = new ExecHashtag();
//			tag.setName("haha"); 
//			execHashtagRepository.save(tag);
//			
//			//save(execPost);
//			execPost.getExecHashtags().add(tag);
//			execHashtagRepository.save(execPost);
//			
//			List<ExecPost> byTag = execPostRepository.findByExecHashtags_NameAndDeletedFalse("haha");
//			assertThat(byTag).isNotEmpty();
//			
//			// 게시글수정
//			// 게시글 삭제 후 조회 불가 
//		} 	
//	
//	@Test
//	@DisplayName("■ HashtagRepository-CRUD ")
//	void testHashtagRepository() {
//		ExecHashtag tag = new ExecHashtag();
//		tag.setName("haha"); 
//		execHashtagRepository.save(tag);
//		// 양방향 관계 동기화
//		post.getHashtags().add(tag);   // List<Post> posts
//		tag.getPosts().add(post);   
//		execHashtagRepository.save(post);
//		
//		Optional<Hashtag> withPosts  = hashtagRepository.findByNameWithPosts("haha");
//		assertThat(withPosts).isPresent();
//		assertThat(withPosts.get().getPosts()).isNotEmpty();
//	}
//	
//
//    // ---------------------------------------------------------------------
//    // PostRepository - hashtags / 
//    // ---------------------------------------------------------------------
////	@Test
////	@DisplayName("■ PostRepository-CRUD ")
////	void testPostsRepository() {
////		// 글삽입시 : 해쉬태그 연결 후 검색
////		Hashtag tag = new Hashtag();
////		tag.setName("haha"); 
////		hashtagRepository.save(tag);
////		
////		post.getHashtags().add(tag);  // List<Hashtag> hashtags
////		postRepository.save(post);
////		
////		List<Post> byTag = postRepository.findByHashtags_NameAndDeletedFalse("haha");
////		assertThat(byTag).isNotEmpty();
////		
////		// 게시글수정
////		post.setContent("수정된 게시글");
////		postRepository.save(post);  
////		assertThat(  postRepository.findById( post.getId() ).get().getContent()  ).isEqualTo("수정된 게시글");
////		 
////		// 게시글 삭제 후 조회 불가 
////		post.setDeleted(true);
////		postRepository.save(post);
////		assertThat(postRepository.findByDeletedFalse()).isEmpty();
////		
////		//페이징테스트
////		for(int i=0; i<5; i++) {
////			Post extra = new Post();
////			extra.setContent("게시글 " + i);
////			extra.setUser(user1);
////			extra.setDeleted(false);
////			postRepository.save(extra);
////		}
//		
//		// 전체글 페이징
//		List<Post>  pagedPosts = postRepository.findPostsWithPaging(1, 3);
//		assertThat(pagedPosts).hasSize(3);
//		
//		// 특정유저 좋아요  ## 좋아할때 추가
//		// 내가쓴 + 리트윗 페이징   ## 리트윗 추가
//		
//	} 
//    // ---------------------------------------------------------------------
//    // CommentRepository - 특정게시글의 삭제되지 않은 댓글 목록 조회 /삭제되지 않은 댓글 수 집계
//    // ---------------------------------------------------------------------
//	@Test
//	@DisplayName("■ CommentRepository-CRUD ")
//	void testCommentRepository() {
//		// 댓글 생성
//		Comment comment = new Comment();	
//		comment.setContent("테스트 댓글"); 
//		comment.setUser(user2);
//		comment.setPost(post);
//		comment.setDeleted(false);
//		commentRepository.save(comment);
//		
//		// 특정게시글의 삭제되지 않은 댓글 목록 조회
//		List<Comment>  comments = commentRepository.findByPostIdAndDeletedFalse(post.getId());
//		assertThat(comments).hasSize(1);
//		
//		// 댓글 수정
//		comment.setContent("수정된 댓글");
//		commentRepository.save(comment);
//		assertThat(  commentRepository.findById( comment.getId() ).get().getContent()  ).isEqualTo("수정된 댓글");
//		
//		// soft delete 처리 댓글 삭제 - 삭제되지 않은 댓글 수 집계
//		comment.setDeleted(true);
//		commentRepository.save(comment);
//		assertThat(  commentRepository.countByPostIdAndDeletedFalse(post.getId())  ).isEqualTo(0L);
//
//	}
//
//    // ---------------------------------------------------------------------
//    // PostLikeRepository 
//	// - 특정 게시글의 좋아요 수 집계 / 특정 유저가 특정 게시글에 좋아요 했는지 여부 
//	// - 좋아요 취소 (조회없이 바로 삭제) / 특정유저의 특정게시글 좋아요 조회
//    // ---------------------------------------------------------------------
//	@Test
//	@DisplayName("■ PostLikeRepository-CRUD ")
//	void testPostLikeRepository() {
//		// 좋아요 생성 (user2 → post) 
//		PostLike like= new PostLike(user2, post);
//		postLikeRepository.save(like);
//		
//		// 특정 유저가 특정 게시글에 좋아요 했는지
//		Optional<PostLike> found = postLikeRepository.findByUser_IdAndPost_Id(user2.getId(), post.getId());
//		assertThat(found).isPresent();
//		
//		// 특정 게시글의 좋아요 수  집계
//		assertThat( postLikeRepository.countByUser_IdAndPost_Id(user2.getId(), post.getId())  ).isEqualTo(1L);
//		 
//		// 좋아요 취소 (조회없이 바로 삭제) / 특정유저의 특정게시글 좋아요 조회
//		postLikeRepository.deleteByUserAndPost(user2.getId(), post.getId()); 
//		assertThat( postLikeRepository.countByUser_IdAndPost_Id(user2.getId(), post.getId())  ).isEqualTo(0L);
//
//	}
//	
//    // ---------------------------------------------------------------------
//    // RetweetRepository  
//    // ---------------------------------------------------------------------
//	@Test
//	@DisplayName("■ RetweetRepository-CRUD ")
//	void testRetweetRepository() {
//		// 리트윗 생성 (user2 → post) 
//		Retweet retweet = new Retweet(user2, post);
//		retweetRepository.save(retweet);
//
//		// 특정유저의 특정게시글 리트윗 조회
//		Optional<Retweet>  found  = retweetRepository.findByUserAndOriginalPost(user2.getId(), post.getId());
//		assertThat(found).isPresent();
//		
//		// 특정게시글의 리트윗 수
//		assertThat(  retweetRepository.countByOriginalPostId(  post.getId()  )  ).isEqualTo(1L);
//		
//		// 리트윗취소
//		retweetRepository.deleteByUserAndOriginalPost(   user2.getId(), post.getId()  );
//        assertThat(retweetRepository.countByUserAndOriginalPost(user2.getId(), post.getId())).isEqualTo(0L);
//        assertThat(retweetRepository.countByOriginalPostId(post.getId())).isEqualTo(0L);
//	}
//	
//	// ---------------------------------------------------------------------
//	// FollowRepository
//	// ---------------------------------------------------------------------
//	@Test
//	@DisplayName("■ FollowRepository - CRUD + 팔로잉/팔로워 조회/집계")
//	void testFollowRepository() {
//	    // 팔로우 생성 (user1 → user2)
//	    Follow follow = new Follow(user1, user2);
//	    followRepository.save(follow);
//
//	    // 팔로우 단건 조회
//	    assertThat(followRepository.findByFollower_IdAndFollowee_Id(user1.getId(), user2.getId())).isPresent();
//
//	    // 팔로잉 목록 조회 (EntityGraph로 followee 조인)
//	    List<Follow> followings = followRepository.findByFollower_Id(user1.getId());
//	    assertThat(followings).hasSize(1);
//	    assertThat(followings.get(0).getFollowee().getId()).isEqualTo(user2.getId());
//
//	    // 팔로워 목록 조회 (EntityGraph로 follower 조인)
//	    List<Follow> followers = followRepository.findByFollowee_Id(user2.getId());
//	    assertThat(followers).hasSize(1);
//	    assertThat(followers.get(0).getFollower().getId()).isEqualTo(user1.getId());
//
//	    // 팔로잉/팔로워 수 집계
//	    assertThat(followRepository.countByFollower_Id(user1.getId())).isEqualTo(1L);
//	    assertThat(followRepository.countByFollowee_Id(user2.getId())).isEqualTo(1L);
//
//	    // 삭제 후 조회 불가 확인
//	    followRepository.delete(follow);
//	    assertThat(followRepository.findByFollower_IdAndFollowee_Id(user1.getId(), user2.getId())).isEmpty();
//	}
//	
// 
//	
//	
//}
//
///*
//          사용자      관리자
//CREATE    ◎회원가입    ◎회원가입
//READ      로그인, 이메일중복, 닉네임중복 
//UPDATE    ◎닉네임수정, ◎이미지수정
//DELETE    ◎회원탈퇴
//*/
//
//
