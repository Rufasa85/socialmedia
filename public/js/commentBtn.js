document.addEventListener("submit",e=>{
    if(e.target.matches(".addCommentForm")){
        e.preventDefault();
       const commentObj= {
           body:e.target.children[0].value,
           postId:e.target.children[1].value
       }

       fetch("/api/comments",{
           method:"POST",
           body:JSON.stringify(commentObj),
           headers:{
               "Content-Type":"application/json"
           }
       }).then(res=>{
           if(res.ok){
               location.reload()
           } else {
              alert("sad dog")
           }
       })
    }
})