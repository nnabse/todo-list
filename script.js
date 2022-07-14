const allTasks = JSON.parse(localStorage.getItem("tasks")) || [];

let input = "";
let inputValue = "";

let renameValue = "";
let renameInput = "";

let editOpened = false;

let editVisible = [0, false];

window.onload = init = () => {
  input = document.getElementById("text_input");
  input.addEventListener("change", updateValue);
  render();
};

const addTask = () => {
  if (inputValue !== "" && inputValue !== " ") {
    allTasks.push({
      text: inputValue,
      isChecked: false,
      isEdit: false,
    });
  }

  localStorage.setItem("tasks", JSON.stringify(allTasks));
  inputValue = "";
  input.value = "";
  render();
};

const onCheckboxChange = (index) => {
  allTasks[index].isChecked = !allTasks[index].isChecked;
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  render();
};

const deleteTask = (index) => {
  allTasks.splice(index, 1);
  editOpened = false;
  editVisible = false;
  localStorage.setItem("tasks", JSON.stringify(allTasks)); 
  render();
};

const toggleEditVisible = (index) => {
  allTasks.forEach((elem) => {
    if (editOpened === false) {
      allTasks[index].isEdit = true;
      renameValue = renameInput.value;
      editOpened = true;
      render();
    }
    if(elem.isEdit) return 0; 
  });
};

const updateValue = (event) => {
  inputValue = event.target.value;
  localStorage.setItem("tasks", JSON.stringify(allTasks));
};



const onRename = (index) => {
  if (renameValue !== "" && renameValue !== " ") {
    if(renameValue === undefined) renameValue = allTasks[index].text;
    editOpened = false;
    allTasks[index].text = renameValue;
    allTasks[index].isEdit = false;
  }
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  render();
};

const onCancel = (index) => {
  editOpened = false;
  allTasks[index].text = allTasks[index].text;
  allTasks[index].isEdit = !allTasks[index].isEdit;
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  render();
};

const render = () => {
  const content = document.getElementById("tasks_list");
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
  allTasks.sort((a, b) =>
    a.isChecked > b.isChecked ? 1 : a.isChecked < b.isChecked ? -1 : 0
  );
  allTasks.map((item, index) => {
    const container = document.createElement("div");
    container.id = `task_${index}`;
    container.className = "task";

    const editForm = document.createElement("input");
    editForm.className = "rename_input";
    editForm.value = allTasks[index].text;

    const updateRenameValue = (event) => {
      renameValue = event.target.value;
      localStorage.setItem("tasks", JSON.stringify(allTasks));
    };

    editForm.addEventListener("change", updateRenameValue);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.isChecked;
    checkbox.onchange = () => onCheckboxChange(index);

    const text = document.createElement("p");
    text.innerText = item.text;
    text.className = item.isChecked ? "task-text done-text" : "task-text";

    const editButton = document.createElement("img");
    editButton.src = "images/edit.svg";
    editButton.onclick = () => toggleEditVisible(index);

    const deleteButton = document.createElement("img");
    deleteButton.src = "images/delete.svg";
    deleteButton.onclick = () => deleteTask(index);

    const renameButton = document.createElement("img");
    renameButton.src = "images/done.svg";
    renameButton.onclick = () => onRename(index);

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