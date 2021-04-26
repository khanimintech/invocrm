newsData=[
    {
        postId:1,
        postCategory:'Demo Category',
        postTitle:'Demo Post Title',
        postDescription:'Demo Post Description',
        postBtnUrl:'#',
        postImageUrl: "img/img1/jpg"    
    },
    {
        postId:2,
        postCategory:'Demo Category',
        postTitle:'Demo Post Title',
        postDescription:'Demo Post Description',
        postBtnUrl:'#',
        postImageUrl: "img/img2/jpg"
    },
    {
        postId:3,
        postCategory:'Demo Category',
        postTitle:'Demo Post Title',
        postDescription:'Demo Post Description',
        postBtnUrl:'#',
        postImageUrl: "img/img3/jpg"
    }
]

txt=""
let letItemRow=document.querySelector('.row');
for (let i=0;i<newsData.length;i++) {
    txt=""
    <div class="col-4">
    <div class="item">
        <img src="${newsData[i].url}">
    </div>
    </div>
}

letItemRow.innerHTML=txt;

function showImage (e) {
    postImageUrl.querySelector('img').getAttribute('src');
    bodyContent=bodyContent.innerHTML;
    bodyContent= 
    <div class="col-4">
    <div class="item">
        <img src="${newsData[i].url}">
        <button class="prev" onclick='goPrev(this)'>Prev</button>
        <button class="next" onclick='goNext(this)'>Next</button>
    </div>
}

function goPrev (btn) {
    imgSrc=btn.parentElement.previousElementsSiblings.getAttribute('src')

    for (let i=0;i<newsData.length;i++) {
        if (data[i].url==imgSrc){
            document.querySelector('.item-img').setAttribute('src',newsData[i-1].postBtnUrl)
        }
    }
}

function goNext (btn) {
        imgSrc=btn.parentElement.previousElementsSiblings.getAttribute('src')

        for (let i=0;i<newsData.length;i++) {
            if (data[i].url==imgSrc){
                document.querySelector('.item-img').setAttribute('src',newsData[i+1].postBtnUrl)
            }
        }
    }
    
}
