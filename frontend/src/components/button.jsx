import {buttonCahout, buttonSpin} from "../css_config/buttons.js"
export function Button({ action, spinning, text }) {
  return spinning == null ? 
    <button className={buttonCahout} onClick={action}>
      {text}
    </button>
    :
    <button className={buttonSpin} onClick={action} disabled={spinning}>
      {text}
    </button>
  
}


