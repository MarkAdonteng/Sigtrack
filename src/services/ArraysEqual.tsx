interface arrays{
    a:string;
    b:string
}


export const arraysEqual = (arrays:arrays) => {
    if (arrays.a === arrays.b) return true;
    if (arrays.a == null || arrays.b == null) return false;
    if (arrays.a.length !== arrays.b.length) return false;
  
    for (let i = 0; i < arrays.a.length; i++) {
      if (arrays.a[i] !== arrays.b[i]) return false;
    }
  
    return true;
  };
  