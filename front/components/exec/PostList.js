import {Card , List, Button}  from "antd";
import PostCard from "./PostCard"; 
/** PostList 컴포넌트 - posts배열 받아서 PostCard 리스트로 렌더링 */
export default function PostList({
    posts,
    user, 
    likes,
    likesCount,
    retweetedPosts,
    retweetsCount,
    expandedPostId,
    setExpandedPostId,
    handleToggleLike,
    handleToggleFollow,
    handleEdit,
    dispatch,
    likeLoading,
    followingsMap, 
    followLoading,
    title="피드", 
        handleWriteClick,
}){
    return <div  style={{minHeight: "100vh" , padding:"30px 0"}}>
        <Card
        title={title}
        extra={
            <Button
            type="primary"
            size="small"
            htmlType="button"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleWriteClick();
            }}
            >
            글쓰기
            </Button>
        }
        style={{ maxWidth: 700, margin: "0 auto", borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)", backgroundColor: "rgba(255,255,255,0.9)",
        }}
      >
        <List   itemLayout="vertical"     dataSource={posts || []}    rowKey={ (post)=> post.id }
                renderItem={(post)=>(
                    <PostCard 
                        post={post}
                        user={user}
                        likes={likes}
                        likesCount={likesCount}
                        retweetedPosts={retweetedPosts}
                        retweetsCount={retweetsCount}
                        expandedPostId={expandedPostId}
                        setExpandedPostId={setExpandedPostId}
                        handleToggleLike={handleToggleLike}
                        handleToggleFollow={handleToggleFollow}
                        handleEdit={handleEdit}
                        dispatch={dispatch}
                        likeLoading={likeLoading}
                        followingsMap={followingsMap}    
                        followLoading={followLoading}
                    />
                )} 
        /> 
     </Card>
    </div>;
}

// docker
// boot
// react 