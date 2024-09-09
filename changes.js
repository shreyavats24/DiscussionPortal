var textBox=document.getElementById("textArea");
var subject = document.getElementById("title");
var submitButton = document.getElementById("submit");
var queslist=document.getElementById("QuesList");
var quesClick=document.getElementById("quesDetails");
var newQues=document.getElementById("createNewQues");
var revertbtn=document.getElementById("revert");
var response = document.getElementById("Response");
var comment = document.getElementById("comment");
var submitResponse = document.getElementById("submitResponse");
var resolveBtn=document.getElementById("ResolveButn");
var resp=document.getElementById("saveResponse");
var like=document.getElementById("circle");
var dislike=document.getElementById("redcircle");
var searchQues=document.getElementById("search");
var id,check=0;

//submit button pr click hone ke bd input box ki value chck hogi phir values obj ki form me add ques vale function me pass hogi
//last me input box ko empty kr dege 
submitButton.addEventListener("click",function(){
    if(checkInput())
    {
        addQuestion({title:subject.value,description:textBox.value});
    }
    else
    {
        alert("Enter a valid input");
    }
    subject.value="";
    textBox.value="";    
})

function checkInput()
{
    if(subject.value.trim()!=""&&textBox.value.trim()!="")
    return 1;
    else
    return 0;
}
//ques storage se get krke display kra dege
const questions=getQuesFromStorage();
questions.forEach(function(ques){
    displayQuesOnUI(ques);
})

//details ane ke bd obj me store kra di
//obj push kr diya array me 
//phir storage m save kr diya
//display kra diya 
function addQuestion(quesDetails)
{
    const quesId=getQuestionID();
    const question={
        title:quesDetails.title,
        description:quesDetails.description,
        questionId:quesId,
        fav:0,
        unfav:1,
        createdAt:Date.now()
    };
    questions.push(question);
    SaveQuesInStorage(question);
    displayQuesOnUI(question);
}

//ye har bar new ques id get krne ke liye hai
function getQuestionID()
{
    const storageID="quesId";
    const current_id = parseInt(localStorage.getItem(storageID))|| 1;
    localStorage.setItem(storageID,current_id+1);
    return current_id;
}
//yha humne div create kre jisme h tag or p tag hai jisko id di hai taki bad me particular ques ka div access kr paye
function displayQuesOnUI(question)
{
    var Sid=question.questionId;
    const questionContainer = document.createElement("div");
    questionContainer.id="myQues"+question.questionId;
    questionContainer.style.position="relative";
    const title=document.createElement("h3");
    const description = document.createElement("p");
    const createdAt = document.createElement("p");
    title.innerHTML=question.title;
    description.innerHTML=question.description;
    createdAt.innerHTML=new Date(question.createdAt).toLocaleDateString("en"); 
    const unfavImg =document.createElement('img');
    unfavImg.src="dislike.png";
    unfavImg.classList.add("star");
    unfavImg.id="unfillStar"+Sid;
    unfavImg.width="10px";
    const favImg =document.createElement('img');
    favImg.classList.add("star");
    favImg.src="like.png";
    favImg.width="10px";
    favImg.id="fillStar"+Sid;
    questionContainer.appendChild(title);
    questionContainer.appendChild(description);
    questionContainer.appendChild(createdAt);
    if (question.fav === 1) {
        favImg.style.display = "inline";
        unfavImg.style.display = "none";
    } else {
        favImg.style.display = "none";
        unfavImg.style.display = "inline";
    }
    questionContainer.appendChild(unfavImg);
    questionContainer.appendChild(favImg);

    unfavImg.addEventListener("click", function (currEvent) {
        currEvent.stopPropagation();//this will stop the parent event
        question.fav = 1;
        question.unfav = 0;
        
        favImg.style.display = "inline";
        unfavImg.style.display = "none";

        updateQuesInTop(question);//here we are storing changes to storage
        showResultTop(question.questionId);//making changes to ui using dom manipulation
    });

    favImg.addEventListener("click", function ( currEvent) {
        currEvent.stopPropagation();
        question.unfav = 1;
        question.fav = 0;

        unfavImg.style.display = "inline";
        favImg.style.display = "none";

        updateQuestolast(question);
        showResultlast(question.questionId);
        // refreshUI();
    });
    
    queslist.appendChild(questionContainer);
    questionContainer.addEventListener("click",function(event){
        toggleQuesDetailSection();//this function toggles the right pane
        var ques=document.getElementById("fetchedQues");//getting the div where we will display the questions 
        ques.innerHTML="";//firstly empty the div and then append the clicked question to it
        var h=document.createElement("h3");
        h.innerHTML=question.title;
        var p=document.createElement("p");
        p.innerHTML=question.description;
        ques.appendChild(h);
        ques.appendChild(p);
        id=question.questionId;//basically its a global variable that is used to ease the work for resolving the ques and adding the responses
        var d=displayResponse();//getting the responses from the storage
        resp.innerHTML="";
        d.forEach(function(e){
            if(e.respId==id)//displaying all the responses that matches with the id of curr ques being clicked
            {
                addResponse(e);    
            }
        });    
    });
}

function showResultTop(quesId)
{
    const questionElement = document.querySelector(`#myQues${quesId}`);//myques is a div where we have like
    if (questionElement) {
        queslist.removeChild(questionElement);//removing from current position
        queslist.insertBefore(questionElement,queslist.firstChild);//as a first child appended before the prev first child
    }
}
function showResultlast(quesId)
{
    const questionElement = document.querySelector(`#myQues${quesId}`);
    if (questionElement) {
        queslist.removeChild(questionElement);//remove from curr location
        queslist.appendChild(questionElement);//append as last child 
    }

}
function refreshUI() {
    queslist.innerHTML = "";
    //this variable ques have questions taken from the storage
    questions.forEach(function (ques) {
        displayQuesOnUI(ques);
    });
}

function updateQuesInTop(updateQues)
{
    const ques = JSON.parse(localStorage.getItem("question")) || [];
    const newQues=ques.filter(e=>e.questionId!=updateQues.questionId);//storing the ques that dont match with updated ques
    newQues.unshift(updateQues);//we are pushing the updated ques in starting using unshift array method
    localStorage.setItem("question", JSON.stringify(newQues));//storing back to localstorage
}
function updateQuestolast(updateQues)
{
    const ques = JSON.parse(localStorage.getItem("question")) || [];
    const newQues=ques.filter(e=>e.questionId!=updateQues.questionId);
    newQues.push(updateQues);
    localStorage.setItem("question", JSON.stringify(newQues));    
}

revertbtn.addEventListener("click",function()
{
    newQues.classList.remove("hidden");
    quesClick.classList.add("hidden");
});


searchQues.addEventListener("input", function(event) {
    var searchValue = event.target.value.trim();
    refreshUI(); 

    if (searchValue !== "") {
        var regex = new RegExp(`(${searchValue})`, "gi");//regex created using constructor
        //const regex=/`${searchvalue}`/i;

        var allQuestions = document.querySelectorAll("#QuesList > div");//we are getting all the div inside a div having #QuesList as its id and we have got a array of all those divs

        allQuestions.forEach(function(questionElement) {
            var titleElement = questionElement.querySelector("h3");
            var descriptionElement = questionElement.querySelector("p");

            var titleText = titleElement.innerText;
            var descriptionText = descriptionElement.innerText;
            if((regex.test(titleText) || regex.test(descriptionText)))
            {
                var highlightedTitle = titleText.replace(regex, "<span class='highlight'>"+searchValue+"</span>");//here we are replacing the found word with same word inclose in span tag
                titleElement.innerHTML = highlightedTitle;
                var highlightedDescription = descriptionText.replace(regex, "<span class='highlight'>"+searchValue+"</span>");
                descriptionElement.innerHTML = highlightedDescription;
            }
            else
            {
                // console.log(questionElement);
                questionElement.style.display="none";//the ques dont match with regex is hidden now
            }
        });
    }else {
        var allQuestions = document.querySelectorAll("#QuesList > div");
        allQuestions.forEach(function(questionElement) {
            questionElement.style.display = ""; // Reset display to default
        });
    }
});

submitResponse.addEventListener("click",function(){
    if(comment.value.trim()!=""&&response.value.trim()!="")
    {
        const responseObj={
            resp:response.value,
            comment:comment.value,
            respId:id,
            like:0,
            dislike:0,
            netLike:like-dislike
        };
        addResponse(responseObj);
        storeResponse(responseObj);
    }
    else
    { 
        alert("Enter a valid input");
    }
    response.value="";
    comment.value="";    
    
})
function addResponse(responseObj)
{
    var div=document.createElement("div");//div created to store the responses
    div.id="respDiv"+responseObj.respId;
    div.classList.add("responseDiv");
    var h=document.createElement("h3");
    h.innerHTML=responseObj.resp;
    var p=document.createElement("p");        
    p.innerHTML=responseObj.comment;
    var like=document.createElement("img");
    like.src="likeIcon.png";
    like.width=30;
    like.className="circle";

    var dislike=document.createElement("img");
    dislike.src="dislikeIcon.png";
    dislike.width=30;
    dislike.className="redcircle";

    var likeNo=document.createElement("span");
    likeNo.innerHTML=responseObj.like; 
    likeNo.id="likeNo";
    var dislikeNo=document.createElement("span");
    dislikeNo.innerHTML=responseObj.dislike;
    dislikeNo.id="dislikeNo";

    div.appendChild(h);
    div.appendChild(p);
    div.appendChild(like);
    div.appendChild(likeNo);
    div.appendChild(dislikeNo);
    div.appendChild(dislike);
    resp.appendChild(div); 
    like.addEventListener("click",function(){
        responseObj.like+=1;
        likeNo.innerHTML=`${responseObj.like}`;
        updateResponseinstorage(responseObj);//storage is being updated and netlike is also updated here 
        sortResp(responseObj.respId); //it sort the responses and refresh the page and show sorted rsp based on netlike
    })  

    dislike.addEventListener("click",function(){
        responseObj.dislike+=1;
        dislikeNo.innerHTML=`${responseObj.dislike}`;
        updateResponseinstorage(responseObj); 
        sortResp(responseObj.respId); 
    })     
}

function sortResp(quesId) {
    var storeResp = JSON.parse(localStorage.getItem("response")) || [];
    var selectedResp = storeResp.filter(e => e.respId == quesId);
    selectedResp.sort(function(a, b) {
        return b.netLike - a.netLike;//sorting data based on netlike
    });
    storeResp = storeResp.filter(e => e.respId != quesId);//storing unamtched id as it is

    storeResp = storeResp.concat(selectedResp);//sorted result is being concat to filtered data 
    localStorage.setItem("response", JSON.stringify(storeResp));

    refreshResponseUI(quesId);
}



function refreshResponseUI(quesId) {//re write response to UI 
    resp.innerHTML = "";
    var responses = JSON.parse(localStorage.getItem("response")) || [];
    var selectedResp = responses.filter(e => e.respId == quesId);
    selectedResp.forEach(function(respo) {
    addResponse(respo);
    });
}

function storeResponse(responseObj)
{
    const storeResp = JSON.parse(localStorage.getItem("response"))|| []; 
    storeResp.push(responseObj);
    localStorage.setItem("response",JSON.stringify(storeResp));
}

function updateResponseinstorage(updatedResponse)
{
    const responses = JSON.parse(localStorage.getItem("response")) || [];
    const index = responses.findIndex(resp => resp.id === updatedResponse.id && resp.comment === updatedResponse.comment && resp.resp === updatedResponse.resp);
    if (index !== -1) {
        updatedResponse.netLike=updatedResponse.like-updatedResponse.dislike;//netLike finding
        responses[index] = updatedResponse; //exct index  data  overwrited
    }
    localStorage.setItem("response", JSON.stringify(responses));
}

function displayResponse()
{
    var savedResp=localStorage.getItem("response");
    if(!savedResp)
    {
        return [];
    }
    return JSON.parse(savedResp);
}

resolveBtn.addEventListener("click", function() {
    removeQuestionAndResponses(id);//id having the clicked ques id 
    
    newQues.classList.remove("hidden");
    quesClick.classList.add("hidden");
});

function removeQuestionAndResponses(quesId) {
    removeQuestionFromStorage(quesId);
    removeQuestionFromUI(quesId);
    
    removeResponsesFromStorage(quesId);
    removeResponsesFromUI(quesId);
}

function removeQuestionFromStorage(quesId) {
    //const listQues = getQuesFromStorage();
    const updatedQues = questions.filter(e => e.questionId != quesId);//unmatched id data is filtered and stored  
    if (updatedQues.length == 0) {
        localStorage.removeItem("question");//if filtered data is empty remove it from the storage
    } else {
        localStorage.setItem("question", JSON.stringify(updatedQues));//nhi to vps store kr do sb filtered data
    }
}

function removeQuestionFromUI(quesId) {
    const questionElement = document.querySelector(`#myQues${quesId}`);
    if (questionElement) {
        queslist.removeChild(questionElement);//bina refresh hue ui se remove krre hai child
    }
}

function removeResponsesFromStorage(quesId) {
    const responses = JSON.parse(localStorage.getItem("response")) || [];
    const updatedResponses = responses.filter(e => e.respId != quesId);
    if (updatedResponses.length == 0) {
        localStorage.removeItem("response");
    } else {
        localStorage.setItem("response", JSON.stringify(updatedResponses));
    }
}

function removeResponsesFromUI(quesId) {
    const responseElements = document.querySelectorAll(`#respDiv${quesId}`);
    responseElements.forEach(el => {
        resp.removeChild(el);
    });
}

function toggleQuesDetailSection()
{ 
    newQues.classList.add("hidden");
    quesClick.classList.remove("hidden");
}


function SaveQuesInStorage(question) {
    //let oldData =getQuesFromStorage();
    //ques.push(question);
    localStorage.setItem("question", JSON.stringify(questions));
}

function getQuesFromStorage() {
    var oldData = localStorage.getItem("question");
    if (oldData) {
        oldData = JSON.parse(oldData);
    } 
    else
    {
        return oldData= [];
    }
    return oldData;
}
