import axios from "axios";


export const checkValidWord = async (word: string) =>{
  try{
    const res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if( res.status===200){
      return true; 
    }
    else{
      return false; 
    }
  }
  catch(e){
    console.log("Something went wrong...!");
    return false;
    
  }
}