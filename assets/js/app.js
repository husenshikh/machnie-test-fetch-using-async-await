const cl= console.log;

const postform = document.getElementById("postform");
const titleControl = document.getElementById("title");
const bodyControl = document.getElementById("body");
const userIdControl = document.getElementById("userId");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const cardContainer = document.getElementById("cardContainer");
const loader = document.getElementById("loader");

const baseUrl = `https://post-crud-656a3-default-rtdb.asia-southeast1.firebasedatabase.app`;

const postUrl = `${baseUrl}/posts.json`

const creatSingleCard = (obj) => {
        let card = document.createElement("div")
        card.className = "card mb-4"
        card.id = obj.id
        card.innerHTML = `
                            <div class="card-header">
                            <h4 class="m-0">${obj.title}</h4>
                            </div>
                            <div class="card-body">
                                <p class="m-0">${obj.body}</p>
                            </div>
                            <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                            <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                            </div>
                            `
                            cardContainer.append(card)
}


const creatCards = (arr) => {
        cardContainer.innerHTML = arr.map(obj => {
            return `
                        <div class="card mb-4" id="${obj.id}">
                            <div class="card-header">
                                <h4 class="m-0">${obj.title}</h4>
                            </div>
                            <div class="card-body">
                                <p class="m-0">${obj.body}</p>
                            </div>
                            <div class="card-footer d-flex justify-content-between">
                                <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                                <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                            </div>
                        </div>
                    `
        }).join("")
}

const onEdit = async (ele) => {
    try{
        let editId = ele.closest(".card").id
    localStorage.setItem("editId",editId)
    let editUrl = `${baseUrl}/posts/${editId}.json`
    let res = await makeApiCall("GET",editUrl)
    cl(res)

    titleControl.value = res.title;
    bodyControl.value = res.body;
    userIdControl.value = res.userId

    submitBtn.classList.add("d-none")
    updateBtn.classList.remove("d-none")
    }
    catch(err){
        cl(err)
    }
    finally{
        loader.classList.add("d-none")
    }
    
}

const onDelete =  async (ele) => {
   try{
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(async(result) => {
        if (result.isConfirmed) {

            let deleteId = ele.closest(".card").id
        let deleteUrl = `${baseUrl}/posts/${deleteId}.json`

       let res = await makeApiCall("DELETE",deleteUrl)

      ele.closest(".card").remove()
          Swal.fire({
            title: "post is Deleted successfully !!!",
            icon: "success",
            timer : 2000
          });
        }
      });
   }
   catch(err){
    cl(err)
   }
   finally{
    loader.classList.add("d-none")
   }

}



const makeApiCall = async (methodName,apiUrl,msgBody) => {
    
    msginfo = msgBody ? JSON.stringify(msgBody) : null;
    loader.classList.remove("d-none");
    let res = await fetch (apiUrl, {
        method : methodName,
        body : msginfo
    })

    return res.json()
}


const fetchAllPosts = async () => {
    try{
        let res = await makeApiCall("GET",postUrl)
   // cl(res)
    let postArr = []
    for (const key in res) {
       let obj = {...res[key], id : key}
       postArr.push(obj)
            
        }
        creatCards(postArr)
        Swal.fire({
            title : `all posts are created successfully !!!`,
            icon : `success`,
            timer : 2000
        })
    }
    catch(err){
        cl(err)
    }
    finally{
        loader.classList.add("d-none")
    }
    }
fetchAllPosts()

const onPostSubmit = async (eve) => {
        eve.preventDefault()
       try{
        let obj = {
            title : titleControl.value,
            body : bodyControl.value,
            userId : userIdControl.value
        }
       // cl(obj)

       let res = await makeApiCall("POST",postUrl,obj)
      // cl(res)
       obj.id = res.id
       creatSingleCard(obj)
       Swal.fire({
        title : `post is Submited successfully !!!`,
        icon : `success`,
        timer : 2000
    })
       }
       catch(err){
        cl(err)
       }
       finally{
        postform.reset()
        loader.classList.add("d-none")
       }

}

const onupdatePost = async () => {
    let newpost = {
        title : titleControl.value,
        body : bodyControl.value,
        userId : userIdControl.value
    }
    

    try{
        let updatedId = localStorage.getItem("editId")
    let updatedUrl = `${baseUrl}/posts/${updatedId}.json`

    let res = await makeApiCall("PATCH",updatedUrl,newpost)
    cl(res)
    newpost.id = updatedId

    let card = [...document.getElementById(updatedId).children];
    card[0].innerHTML = `<h4 class="m-0">${newpost.title}</h4>`;
    card[1].innerHTML = `<p class="m-0">${newpost.body}</p>`;
    Swal.fire({
        title: "post is Updated successfully !!!",
        icon: "success",
        timer : 2000
      });
    }
    catch(err){
        cl(err)
    }
    finally{
         
        loader.classList.add("d-none")
        postform.reset()
        updateBtn.classList.add("d-none")
        submitBtn.classList.remove("d-none")
    }


   

   
}

postform.addEventListener("submit", onPostSubmit)
updateBtn.addEventListener("click",onupdatePost)