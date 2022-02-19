const items = document.querySelector('.items');
const input = document.querySelector('.footer__input');
const addBtn = document.querySelector('.footer__button');
const clearBtn = document.querySelector('.footer__button-clear');
const selectBtn = document.querySelector('.select__modify');
const delBtn = document.querySelector('.select__del');
const unBtn = document.querySelector('.select__un');
const all = document.querySelector('.all');
const undone = document.querySelector('.undone');
const done = document.querySelector('.done__done');
let obj = {
    text: '',
    isCheck: false
};

function onAdd() {
    // 1. 사용자가 입력한 텍스트를 받아옴
    const text = input.value;
    if (text === '') {
        input.focus();
        return;
    }
    // 2. 새로운 아이템을 만듦 ( 텍스트 + 삭제 버튼)
    const item = createItem(text);
    // 3. items 컨테이너안에 새로 만든 아이템을 추가한다
    items.appendChild(item);
    // 4. 새로 추가된 아이템으로 스크롤링
    item.scrollIntoView({ block: 'center' });
    // 5. 인풋을 초기화 한다.
    input.value = '';
    input.focus();
}

function onReAdd(text) {
    const item = createItem(text);
    items.appendChild(item);
    item.scrollIntoView({ block: 'center' });
    input.value = '';
    return;
}

function setStorageItem(checkId, text, check) {
    obj.text = text;
    obj.isCheck = check;
    localStorage.setItem(checkId, JSON.stringify(obj));
}

let cnt;
if (localStorage.length > 0) {
    cnt = 0;
    let count = localStorage.length;
    for (let i = 0; i < count; i++) {
        let text = JSON.parse(localStorage.getItem(i));
        // console.log(text);
        let value = text.text;
        // console.log(value);
        onReAdd(value);
    }
}
else cnt = 0;
function createItem(text) {
    const itemRow = document.createElement('li');
    itemRow.setAttribute('class', 'items__row');

    const item = document.createElement('div');
    item.setAttribute('class', 'item');

    const span = document.createElement('span');
    span.setAttribute('class', 'item__name');
    span.innerText = text;
    span.style.textDecoration = 'none';
    span.addEventListener('click', () => {
        if (clearBtn.className === 'footer__button-clear') {
            const check = document.querySelectorAll('.item__check');
            const del = document.querySelectorAll('.item__delete');
            const t = span.textContent;
            clearBtn.innerHTML = 'fix';
            input.value = t;
            clearBtn.setAttribute('class', 'footer__button-clear fixMode');
            span.setAttribute('class', 'item__name fix');
            span.style.fontWeight = 'bold';

            for (let i = 0; i < check.length; i++) {
                check[i].style.display = 'none';
                del[i].style.display = 'none';
            }
        }
    });

    const bundle = document.createElement('div');
    bundle.setAttribute('class', 'btnBundle');

    const checkBox = document.createElement('input');
    checkBox.setAttribute('id', `${cnt}`);
    // console.log(`현재 cnt 값: ${cnt}`);
    cnt++;
    // console.log(`추가 후 cnt 값: ${cnt}`);
    checkBox.setAttribute('type', 'checkbox');
    checkBox.setAttribute('class', 'item__checkBox');

    const checkBtn = document.createElement('button');
    checkBtn.setAttribute('class', 'item__check');
    checkBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    if (localStorage.getItem(checkBox.id) !== null) {
        const tt = JSON.parse(localStorage.getItem(checkBox.id));
        const c = tt.isCheck;
        setStorageItem(checkBox.id, text, c);
        if (c === true) {
            checkBtn.style.color = '#91dfa8';
            span.style.textDecoration = 'line-through';
            span.style.color = '#b8b8b8'
        }
    }
    else {
        setStorageItem(checkBox.id, text, false);
    }
    checkBtn.addEventListener('click', () => {
        if (span.style.textDecoration === 'none') {
            span.style.textDecoration = 'line-through';
            span.style.color = '#b8b8b8';
            checkBtn.style.color = '#91dfa8';
            const tt = JSON.parse(localStorage.getItem(checkBox.id));
            const t = tt.text;
            const c = true;
            obj.text = t;
            obj.isCheck = c;
            setStorageItem(checkBox.id, t, c);
            if (undone.style.fontWeight === 'bold') {
                onUndone();
            }
            else if (done.style.fontWeight === 'bold') {
                onDone();
            }
        }
        else if (span.style.textDecoration === 'line-through') {
            span.style.textDecoration = 'none';
            span.style.color = 'rgb(82, 82, 82)';
            checkBtn.style.color = 'rgb(82, 82, 82)';
            const tt = JSON.parse(localStorage.getItem(checkBox.id));
            const t = tt.text;
            const c = false;
            obj.text = t;
            obj.isCheck = c;
            setStorageItem(checkBox.id, t, c);
            if (undone.style.fontWeight === 'bold') {
                onUndone();
            }
            else if (done.style.fontWeight === 'bold') {
                onDone();
            }
        }
    })

    const deleteBtn = document.createElement('button');
    deleteBtn.setAttribute('class', 'item__delete');
    // <i></i>는 변동될 일 없으므로 
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteBtn.addEventListener('click', () => {
        const checkId = checkBox.getAttribute('id');
        cnt = Number(checkId);
        items.removeChild(itemRow);
        localStorage.removeItem(checkId);
        const checkNum = document.querySelectorAll('.item__checkBox');
        for (let i = Number(checkId); i < checkNum.length; i++) {
            checkNum[i].id = `${cnt}`;
            cnt++;
            let ts = JSON.parse(localStorage.getItem(i + 1));
            let t = ts.text;
            let c = ts.isCheck;
            obj.text = t;
            obj.isCheck = c;
            setStorageItem(i, t, c);
            localStorage.removeItem(i + 1);
        }
    })

    const itemDivider = document.createElement('div');
    itemDivider.setAttribute('class', 'item__divider');

    bundle.appendChild(checkBtn);
    bundle.appendChild(deleteBtn);
    bundle.appendChild(checkBox);

    item.appendChild(span);
    item.appendChild(bundle);

    itemRow.appendChild(item);
    itemRow.appendChild(itemDivider);

    return itemRow;
}


function onFix() {
    const span = document.querySelector('.fix');
    const tt = document.querySelectorAll('.item__name');
    const check = document.querySelectorAll('.item__check');
    const del = document.querySelectorAll('.item__delete');
    const text = input.value;

    span.innerHTML = text;

    for (let i = 0; i < tt.length; i++) {
        if (tt[i].textContent === text) {
            let ts = JSON.parse(localStorage.getItem(i));
            const c = ts.isCheck;
            setStorageItem(i, text, c);
        }
    }

    input.value = '';
    input.focus();
    clearBtn.innerHTML = 'clear';
    span.style.fontWeight = 'normal';
    span.setAttribute('class', 'item__name');
    clearBtn.setAttribute('class', 'footer__button-clear');

    for (let i = 0; i < check.length; i++) {
        check[i].style.display = 'block';
        del[i].style.display = 'block';
    }
}

function onAll() {
    const row = document.querySelectorAll('.items__row');
    all.style.color = 'rgb(224,168,210)';
    all.style.fontWeight = 'bold';
    undone.style.color = 'rgb(82, 82, 82)';
    undone.style.fontWeight = 'normal';
    done.style.color = 'rgb(82, 82, 82)';
    done.style.fontWeight = 'normal';

    for (let i = 0; i < row.length; i++) {
        row[i].style.display = 'block';
    }
}

function onUndone() {
    const check = document.querySelectorAll('.item__name');
    const row = document.querySelectorAll('.items__row');
    undone.style.color = 'rgb(224,168,210)';
    undone.style.fontWeight = 'bold';
    all.style.color = 'rgb(82, 82, 82)';
    all.style.fontWeight = 'normal';
    done.style.color = 'rgb(82, 82, 82)';
    done.style.fontWeight = 'normal';

    for (let i = 0; i < check.length; i++) {
        if (check[i].style.textDecoration === 'none') {
            row[i].style.display = 'block';
        }
        else {
            row[i].style.display = 'none';
        }
    }
}

function onDone() {
    const check = document.querySelectorAll('.item__name');
    const row = document.querySelectorAll('.items__row');
    done.style.color = 'rgb(224,168,210)';
    done.style.fontWeight = 'bold';
    all.style.color = 'rgb(82, 82, 82)';
    all.style.fontWeight = 'normal';
    undone.style.color = 'rgb(82, 82, 82)';
    undone.style.fontWeight = 'normal';

    for (let i = 0; i < check.length; i++) {
        if (check[i].style.textDecoration === 'line-through') {
            row[i].style.display = 'block';
        }
        else {
            row[i].style.display = 'none';
        }
    }
}

addBtn.addEventListener('click', () => {
    if (clearBtn.className === 'footer__button-clear') {
        onAdd();
    }
});

input.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        if (clearBtn.className === 'footer__button-clear') {
            onAdd();
        }
        else if (clearBtn.className === 'footer__button-clear fixMode') {
            onFix();
        }
    }
});

all.addEventListener('click', () => {
    onAll();
});

undone.addEventListener('click', () => {
    onUndone();
});

done.addEventListener('click', () => {
    onDone();
});

clearBtn.addEventListener('click', () => {
    const itemRow = document.querySelectorAll('.items__row');
    // console.log(v);
    if (clearBtn.className === 'footer__button-clear') {
        for (let i = 0; i < itemRow.length; i++) {
            items.removeChild(itemRow[i]);
        }
        cnt = 0;
        localStorage.clear();
        input.focus();
    }
    else if (clearBtn.className === 'footer__button-clear fixMode') {
        onFix();
        input.focus();
    }
});

selectBtn.addEventListener('click', () => {
    if (selectBtn.className != 'select__modify click' && clearBtn.className !== 'footer__button-clear fixMode') {
        const check = document.querySelectorAll('.item__checkBox');
        const ch = document.querySelectorAll('.item__check');
        const del = document.querySelectorAll('.item__delete');
        selectBtn.className = 'select__modify click';
        selectBtn.style.display = 'none';
        unBtn.className = 'select__un show';
        unBtn.style.display = 'inline-block';
        delBtn.className = 'select__del show';
        delBtn.style.display = 'inline-block';

        for (let i = 0; i < check.length; i++) {
            check[i].style.display = 'block';
            ch[i].style.display = 'none';
            del[i].style.display = 'none';
        }

        input.readOnly = true;
        input.value = '값을 입력하려면 선택모드를 해제해주세요.';
        input.style.color = '#b9b9b9';
        input.style.fontSize = '15px';
        clearBtn.className = 'footer__button-clear sel'
    }
});

unBtn.addEventListener('click', () => {
    const check = document.querySelectorAll('.item__checkBox');
    const ch = document.querySelectorAll('.item__check');
    const del = document.querySelectorAll('.item__delete');

    selectBtn.className = 'select__modify';
    selectBtn.style.display = 'inline-block';
    unBtn.className = 'select__un';
    unBtn.style.display = 'none';
    delBtn.className = 'select__del';
    delBtn.style.display = 'none';

    for (let i = 0; i < check.length; i++) {
        check[i].style.display = 'none';
        ch[i].style.display = 'block';
        del[i].style.display = 'block';
    }

    clearBtn.className = 'footer__button-clear'
    input.readOnly = false;
    input.value = '';
    input.style.color = 'black';
    input.style.fontSize = '24px';
    input.focus();
});

delBtn.addEventListener('click', () => {
    if (delBtn.className == 'select__del show') {
        const li = document.querySelectorAll('.items__row');
        const check = document.querySelectorAll('.item__checkBox');
        selectBtn.className = 'select__modify';
        selectBtn.style.display = 'inline-block';
        unBtn.className = 'select__un';
        unBtn.style.display = 'none';
        delBtn.className = 'select__del';
        delBtn.style.display = 'none';

        arr = [];
        for (let i = 0; i < check.length; i++) {
            let id = check[i].getAttribute('id');
            let isCheck = document.getElementById(`${id}`).checked;
            if (isCheck) {
                items.removeChild(li[i]);
                localStorage.removeItem(i);
            }
            else {
                arr.push(i);
            }
        }
        console.log(arr);

        cnt = 0;
        const check2 = document.querySelectorAll('.item__checkBox');
        const ch = document.querySelectorAll('.item__check');
        const del = document.querySelectorAll('.item__delete');
        for (let i = 0; i < check2.length; i++) {
            check2[i].id = `${cnt}`;
            check2[i].style.display = 'none';
            ch[i].style.display = 'block';
            del[i].style.display = 'block';
            cnt++;
            let ts = JSON.parse(localStorage.getItem(arr[i]));
            let t = ts.text;
            let c = ts.isCheck;
            obj.text = t;
            obj.isCheck = c;
            localStorage.removeItem(arr[i]);
            setStorageItem(i, t, c);
        }

        clearBtn.className = 'footer__button-clear'
        input.readOnly = false;
        input.value = '';
        input.style.color = 'rgb(82, 82, 82)';
        input.style.fontSize = '24px';
        input.focus();
    }
});