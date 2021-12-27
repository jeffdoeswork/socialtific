// This module contains universal non-ascync functions
// ie helper functions

export function truncateWords(text, wordCount){
  let result = ""
  result = text.split(" ").slice(0, wordCount).join(" ")+"..."
  return result
}

export function createGroupURL(name){
    let url = name.toLowerCase()
    if (name.split(" ").length > 1){
        url = url.replace(" ","-")
    }
    return url
}

export function capitalize(word){
  let newWord;
  newWord = word.charAt(0).toUpperCase() + word.substring(1)
  return newWord
}