export const handleWordQuiz = (word) => {
    let ans = "";
    for(let i = 0; i<word.length; i++) {
        if(word[i] === " ") {
            ans += " ";
        } else {
            ans += "-"
        }
    }
    return ans;
}

function bodauTiengViet(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    return str;
}

export const compareQuiz = (quiz, answer) => {
    if(quiz === answer) return true;

    if(bodauTiengViet(quiz) === bodauTiengViet(answer)) return true;

    return false;
}

export const handleName = (name) => {
    if(name.length > 12) {
        return name.substring(0, 10) +  "..."
    }
    return name;
}