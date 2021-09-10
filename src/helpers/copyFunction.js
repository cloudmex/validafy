 const v = (text) => {
    console.log('text', text)
    var textField = document.createElement('textarea')
    textField.innerText = text
    document.head.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  }