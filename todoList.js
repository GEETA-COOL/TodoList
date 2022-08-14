// If user adds a add add to the local store

let trElem;
let addtxt = document.getElementById('addtxt');
let addCategory = document.getElementById('categoryId');
let addDate = document.getElementById('addDate');
let addTime = document.getElementById('addTime');
let addbtn = document.getElementById('addbtn');
let selectElem = document.getElementById('categoryFilter');
let todoTable = document.getElementById('todoTable');
let pendingList = document.getElementById('pendingList');
const DEFAULT_OPTION='Choose Category';



addbtn.addEventListener('click', addList);
selectElem.addEventListener('change', filterCategory);
pendingList.addEventListener('click',displayPendingList);


updateSelectedOptionCategory();
renderRows();



function addList(e) {

    let notes = localStorage.getItem('notes');
    if (notes == null) {
        notesObj = [];
    } else {
        notesObj = JSON.parse(notes);
    }
    
    let obj = {
        "id": Date.now(),
        "text": addtxt.value,
        "date": new Date(addDate.value).toLocaleDateString('en-GB', {
            day:'numeric',
            month:'short',
            year:'numeric'
        }),
        "time":addTime.value,
        "category": addCategory.value,
        "done":false
    }
    renderRow(obj);
    notesObj.push(obj);

    // save to local storage
    localStorage.setItem('notes', JSON.stringify(notesObj));
    updateSelectedOptionCategory();

    // Make input value empty
    addtxt.value = "";
    addCategory.value = "";
}

function renderRows(){
    notesObj.forEach((note,index) =>{
        renderRow(note,index);
    });
}

function renderRow(note){
    let todoId = note.id;
    let txtValue = note.text;
    let categoryValue = note.category;
    let todoDate = note.date;
    let todoTime = note.time;
    let isDone = note.done;
    

    // console.log("Index of not object : "+ index)
    // Add a new row
    trElem = document.createElement('tr');
    todoTable.appendChild(trElem);

    // checkBox cell 
    let checkBoxElem = document.createElement('input');
    checkBoxElem.type = 'checkbox';
    checkBoxElem.setAttribute('id',todoId);
    checkBoxElem.addEventListener('click',markedCheckbox);

    // Checking done property
    // console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
    // console.log("Done of object : "+isDone);
    // console.log(" Done for checkBox: "+ checkBoxElem.checked);
    // checkBoxElem.checked = isDone;
    if(isDone == 'true'){
        checkBoxElem.checked = true;
        trElem.classList = 'strike';
    }

    let tdElem1 = document.createElement('td');
    tdElem1.appendChild(checkBoxElem);
    trElem.appendChild(tdElem1);

    // Date cell
    let tdElem2 =  document.createElement('td');
    tdElem2.innerText = todoDate ;
    trElem.appendChild(tdElem2);

    // Time Cell
    let tdElem3 = document.createElement('td');
    tdElem3.innerText = todoTime;
    trElem.appendChild(tdElem3);
    // to-do Cell
    let tdElem4 = document.createElement('td');
    tdElem4.innerText = txtValue ;
    trElem.appendChild(tdElem4);

    // category cell
    let tdElem5 = document.createElement('td');
    tdElem5.innerText = categoryValue;
    trElem.appendChild(tdElem5);

    // Delete Cell
    let iElem = document.createElement('i');
    iElem.className = 'fa fa-trash';
    iElem.setAttribute('id',todoId);
    iElem.addEventListener('click', deleteRow);
    let tdElem6 = document.createElement('td');
    tdElem6.appendChild(iElem);
    trElem.appendChild(tdElem6);

}
function filterCategory() { 
    // console.log("filter event");
    // console.log(selectElem.value);
    let rows = document.getElementsByTagName('tr');
    if (selectElem.value == DEFAULT_OPTION) {
        Array.from(rows).forEach(function (row) {
            row.style.display = '';
        });
    } else {
        Array.from(rows).forEach((row, index, array) => {
            if (index === 0) return;
            let currentCategory = row.getElementsByTagName('td')[4].innerText;
            if (currentCategory == selectElem.value)
                row.style.display = "";
            else row.style.display = 'none';

        });

    }

    // for(let i=1;i<rows.length;i++){
    // let currentCategory = rows[i].getElementsByTagName('td')[2].innerText;

    //     if(currentCategory != selectElem.value)
    //     rows[i].style.display = 'none';
    // }

}


function markedCheckbox() {
    console.log(event.currentTarget.id);
    let markedDone = this.checked;
    // console.log(notesObj);
    notesObj.forEach(function(element, index){
        if(element.id == event.currentTarget.id){
            console.log("markedDone : "+markedDone)
            
            if(markedDone) {
                element.done = 'true';
                console.log(element);
            }else{
                element.done = 'false';
            }
            // console.log("DOne element : "+element.done)
        }
    })
    localStorage.setItem('notes',JSON.stringify(notesObj));
    
    if(this.checked) {
        this.parentNode.parentNode.classList = 'strike';
    }
    else {
        this.parentNode.parentNode.classList = 'none';
    }
    
   
    
    //toggle not working (----DOUBT-----)
    // console.log("Selected Row : "+ trElem.innerText);
    // trElem.classList.toggle('strike');
}
function deleteRow() {

    // console.log(this.id);
    let indexDeleted = this.id;

    console.log('note '+ notesObj[0].id);

    for(let i=0;i<notesObj.length;i++){
        if(notesObj[i].id == indexDeleted){
            notesObj.splice(i,1)
        }
        console.log(notesObj[i].id);
    }
    
    localStorage.setItem('notes',JSON.stringify(notesObj));
    this.parentNode.parentNode.remove();
    updateSelectedOptionCategory();

}


function displayPendingList(){
    console.log('pending');
    console.log(event.currentTarget.checked);
    updateSelectedOptionCategory()

    todoTable.innerHTML =`<tr >
    <th>Marked/Completed</th>
    <th>Date</th>
    <th>Time</th>
    <th>To do Item</th>
    <th>
        <select name="category" id="categoryFilter">
        </select>
    </th>
    <th>delete option</th>
</tr>
`;
    if(event.currentTarget.checked) {
        notesObj.forEach((element)=>{
            if(!element.done)
            renderRow(element);
        })
    }else{
        renderRows();
    }
    
}


function updateSelectedOptionCategory() {
    console.log('Filter')
    let notes = localStorage.getItem('notes');
    if(notes == null) notesObj=[];
    else   notesObj = JSON.parse(notes);

    let optionarr =[];

    notesObj.forEach((element)=>{
        return optionarr.push(element.category);
    })

    console.log(optionarr);
    let optionSet = new Set(optionarr);
    console.log(optionSet);

    // Empty the Option arr
    selectElem.innerHTML ="";

    let newCategoryOption = document.createElement('option');
    newCategoryOption.value = DEFAULT_OPTION;
    newCategoryOption.innerText = DEFAULT_OPTION;
    selectElem.appendChild(newCategoryOption)

    for (let val of optionSet) {
        let newCategoryOption = document.createElement('option');
        newCategoryOption.value = val;
        newCategoryOption.innerText = val;
        selectElem.appendChild(newCategoryOption);
    }
    console.log(selectElem)
}

