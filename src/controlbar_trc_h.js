const resApp = document.getElementById("restartapp");

const restartApp = () => {
  return;
};

resApp.addEventListener('click', () => {
  ipcRenderer.send('reload-me')
})