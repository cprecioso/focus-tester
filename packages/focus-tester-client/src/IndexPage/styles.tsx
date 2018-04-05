import css from "styled-jsx/css"

export const style = css`
  .root {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    align-items: center;

    background: black;
    color: white;
  }
  .controls {
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    align-items: center;
  }
  .buttons {
    margin-top: 10px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    align-items: center;
    width: 100%;
  }
  .buttons button {
    background: black;
    color: white;
    border-radius: 3px;
  }
  button:focus,
  input:focus {
    outline: none;
  }
`
