
/*---- serviceWorker ----*/
if ("serviceWorker" in navigator){
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("/serviceWorker.js")
        .then(res => console.log("service worker registered"))
        .catch(err => console.log("service worker not registered", err))
    })

}

/*---- Configure form currency source and destination ----*/
const currencySrc = ["USD","EUR"];
const currencyDst = ["BRL"];
let currencySrcSelector = document.querySelector("#currencySrc");
let currencyDstSelector = document.querySelector("#currencyDst");

if(currencySrc.length){
    currencySrcSelector.hidden = false;
}
currencySrc.forEach((currency) => {
    let opt = document.createElement("option");
    opt.value = currency;
    opt.innerHTML = currency
    currencySrcSelector.appendChild(opt);
}); 

if(currencyDst.length){
    currencyDstSelector.hidden = false;
}
currencyDst.forEach((currency) => {
    let opt = document.createElement("option");
    opt.value = currency;
    opt.innerHTML = currency
    currencyDstSelector.appendChild(opt);
});

/* ---- Manage Content list ----*/

// Get form data and save on LocalStorage
const formData = document.getElementById("addForm");
const contentListName = "content-list";

formData.addEventListener("click", async(e) => {
    e.preventDefault();
    
    const descField = document.getElementById("descricao").value;
    const qtdField = parseFloat(document.getElementById("quantidade").value);
    const valField = parseFloat(document.getElementById("valor").value);
    const curSrcField = document.getElementById("currencySrc").value;
    const curDstField = document.getElementById("currencyDst").value;

    if (descField == '') {
        alert("O campo descricao precisa ser preenchido!");
        return false;
    };
    if (qtdField == '') {
        alert("O campo quantidade precisa ser preenchido!");
        return false;
    };
    if (valField == '') {
        alert("O campo valor precisa ser preenchido!");
        return false;
    };

    // calculate currency 
    const valCalulated = (qtdField * valField);
    const resp = await fetch(`https://v6.exchangerate-api.com/v6/f02563e9610391938dfa68a8/pair/${curSrcField}/${curDstField}/${valCalulated}`);
    const data = await resp.json();
    const converted = parseFloat(data.conversion_result.toFixed(2));

    // Generate Array to salve on LocalStorage
    const contentList = {
        descField, 
        qtdField, 
        valField, 
        curSrcField, 
        curDstField,
        converted
    };

    const contentLists = JSON.parse(localStorage.getItem(contentListName)) || [];
    contentLists.push(contentList);
    localStorage.setItem(contentListName, JSON.stringify(contentLists));

    clear();
});

/* ---- List all contents from LocalStorage ---- */
function getAllContentList() {
    
    let contentClassSelector = document.querySelector("#content-list");
    let contentList = JSON.parse(localStorage.getItem(contentListName)) || [];
    contentClassSelector.innerHTML = '';
    totalSrcCalc = 0;
    totalDstCalc = 0;
    totalSrcCurrency = "";
    totalDstCurrency = "";
    
    contentList.forEach((list, index) => {

        // List all contents
        let opt = document.createElement("li");
        let optText = document.createTextNode(`${list.descField} (Qtd. ${list.qtdField}): ${list.valField} ${list.curSrcField} => ${list.converted} ${list.curDstField}`);
        opt.classList.add('list-group-item');

        // Edit content index
        let edit = document.createElement("button");
        edit.classList.add('btn', 'btn-info');
        edit.innerHTML = "Edit";
        edit.onclick = function() {
            editContent(index);
        };

        // Delete content index
        let del = document.createElement("button");
        del.classList.add('btn', 'btn-danger');
        del.innerHTML = "Delete";
        del.onclick = function() {
            //alert("Are you sure you wanna delete it?");
            if (confirm("Are you sure you wanna to delete it?") == true) {
                deleteContent(index); 
              } else {
                clear();
              }
        };

        // Calculate totals
        totalSrcCalc += (list.qtdField * list.valField);
        totalDstCalc += list.converted;
        totalSrcCurrency = list.curSrcField;
        totalDstCurrency = list.curDstField;

        // Generate HTML content
        opt.appendChild(optText);
        opt.appendChild(edit);
        opt.appendChild(del);
        contentClassSelector.appendChild(opt);
        
    });
    document.getElementById("totalSrc").innerHTML = `${totalSrcCalc.toFixed(2)} ${totalSrcCurrency}`;
    document.getElementById("totalDst").innerHTML = `${totalDstCalc.toFixed(2)} ${totalDstCurrency}`;
}
    
/* ---- Edit content from LocalStorage ---- */

document.getElementById("updateForm").disabled = true;

function editContent(index) {

    document.getElementById("updateForm").removeAttribute('disabled');

    const contentList = JSON.parse(localStorage.getItem(contentListName)) || [];
    const edit = contentList[index];

    document.getElementById("descricao").value = edit.descField;
    document.getElementById("quantidade").value = edit.qtdField;
    document.getElementById("valor").value = edit.valField;
    document.getElementById("currencySrc").value = edit.curSrcField;
    document.getElementById("currencyDst").value = edit.curDstField;

    const updateformData = document.getElementById("updateForm");

    updateformData.addEventListener("click", async(e) => {
        e.preventDefault();

        const descField = document.getElementById("descricao").value;
        const qtdField = parseFloat(document.getElementById("quantidade").value);
        const valField = parseFloat(document.getElementById("valor").value);
        const curSrcField = document.getElementById("currencySrc").value;
        const curDstField = document.getElementById("currencyDst").value;

        // calculate currency 
        const valCalulated = (qtdField * valField);
        const resp = await fetch(`https://v6.exchangerate-api.com/v6/f02563e9610391938dfa68a8/pair/${curSrcField}/${curDstField}/${valCalulated}`);
        const data = await resp.json();
        const converted = parseFloat(data.conversion_result.toFixed(2));

        const editContentList = {
            descField,
            qtdField,
            valField,
            curSrcField,
            curDstField,
            converted
        }

        contentList.splice(index, 1, editContentList);
        localStorage.setItem(contentListName, JSON.stringify(contentList));
        document.getElementById("updateForm").disabled = true;
        clear();
    });
}

/* ---- Delete content from LocalStorage ---- */
function deleteContent(index) {
    //localStorage.removeItem(index);
    const contentLists = JSON.parse(localStorage.getItem(contentListName)) || [];
    contentLists.splice(index, 1);
    localStorage.setItem(contentListName, JSON.stringify(contentLists));
    clear();
}

/*---- reset forms ----*/
function clear() {
    document.getElementById("descricao").value = "";
    document.getElementById("quantidade").value = "";
    document.getElementById("valor").value = "";
    getAllContentList();
}

/*---- Load DOM Content ----*/
document.addEventListener('DOMContentLoaded', getAllContentList);