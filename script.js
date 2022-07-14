let allTasks = [];

let input = "";
let inputValue = "";

let renameValue = "";
let renameInput = "";

let editVisible = [0, false];

window.onload = init = async () => {
  input = document.getElementById("text_input");
  input.addEventListener("change", updateValue);
  const resp = await fetch("http://localhost:8000/allTasks", {
    method: "GET",
  });
  const result = await resp.json();
  allTasks = result.data;

  render();
};

const addTask = async () => {
  if (inputValue !== "" && inputValue !== " ") {
    const resp = await fetch("http://localhost:8000/createTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        text: inputValue,
        isCheck: false,
        isEdit: false
      }),
    });
    const result = await resp.json();
    allTasks = result.data;
  }

  inputValue = "";
  input.value = "";

  render();
};

const onCheckboxChange = async (index) => {
  const resp = await fetch(`http://localhost:8000/updateTask?id=${allTasks[index].id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        id: allTasks[index].id,
        isCheck: !allTasks[index].isCheck
      }),
  });
  const result = await resp.json();
  allTasks = result.data;
  render();
};

const deleteTask = async (index) => {
  const resp = await fetch(`http://localhost:8000/deleteTask/?id=${allTasks[index].id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      },
    });
  const result = await resp.json();
  allTasks = result.data;
  render();
};

let countOpened = 0;

const toggleEditVisible = (index) => {
  allTasks.forEach((elem) => {
    if (countOpened === 0) {
      allTasks[index].isEdit = true;
      renameValue = renameInput.value
      countOpened++;
      render();
    }
    if (elem.isEdit) {
      return 0;
    }
  });
};

const updateValue = (event) => {
  inputValue = event.target.value;
};

const onRename = async (index, id) => {
  if (renameValue !== "" && renameValue !== " ") {
    const resp = await fetch(`http://localhost:8000/updateTask?id=${allTasks[index].id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          id: allTasks[index].id,
          text: renameValue,
          isCheck: allTasks[index].isCheck
        }),
    });
    const result = await resp.json();
    allTasks = result.data;
    allTasks[index].isEdit = !allTasks[index].isEdit;
  }
  countOpened = 0;
  allTasks[index].isEdit = false;
  render();
};

const onCancel = (index) => {
  countOpened = 0;
  allTasks[index].text = allTasks[index].text;
  allTasks[index].isEdit = !allTasks[index].isEdit;
  render();
};

const render = () => {
  const content = document.getElementById("tasks_list");
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
  allTasks.sort((a, b) => a.isCheck > b.isCheck ? 1 : a.isCheck < b.isCheck ? -1 : 0);
  allTasks.map((item, index) => {
    const itemId = allTasks[index].id;

    const container = document.createElement("div");
    container.id = `task_${index}`;
    container.className = "task";

    const editForm = document.createElement("input");
    editForm.className = "rename_input";
    editForm.value = allTasks[index].text;
    editForm.id = itemId;

    const updateRenameValue = (event) => {
      renameValue = event.target.value;
    };

    editForm.addEventListener("change", updateRenameValue);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.isCheck;
    checkbox.onchange = () => onCheckboxChange(index);

    const text = document.createElement("p");
    text.innerText = item.text;
    text.className = item.isCheck ? "task-text done-text" : "task-text";

    const editButton = document.createElement("img");
    editButton.src = "images/edit.svg";
    editButton.onclick = () => toggleEditVisible(index);

    const deleteButton = document.createElement("img");
    deleteButton.src = "images/delete.svg";
    deleteButton.onclick = () => deleteTask(index);

    const renameButton = document.createElement("img");
    renameButton.src = "images/done.svg";
    renameButton.onclick = () => onRename(index, item.id);

    const cancelRenameButton = document.createElement("img");
    cancelRenameButton.src = "images/cancel.svg";
    cancelRenameButton.onclick = () => onCancel(index);

    container.appendChild(checkbox);
    container.appendChild(text);

    container.appendChild(editButton);
    container.appendChild(deleteButton);

    if (item.isEdit) {
      container.removeChild(text);
      container.removeChild(checkbox);
      container.removeChild(editButton);
      container.appendChild(editForm);
      container.appendChild(renameButton);
      container.appendChild(cancelRenameButton);
    }

    content.appendChild(container);

    if (text.className === "task-text done-text") container.removeChild(editButton);
  });
};
