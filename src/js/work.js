export default class Work {
  static createElm(obj, time) {
    const divRow = document.createElement('div');
    divRow.className = 'row mess-user';
    const divElmt = document.createElement('div');
    divElmt.className = 'element el-user';
    const divMess = document.createElement('div');
    divMess.className = 'mess-user-body';
    divMess.style.paddingRight = '0';
    const divTime = document.createElement('div');
    divTime.className = 'time-stp';
    divTime.innerHTML = time;

    divMess.append(obj.content);
    divElmt.append(divMess);
    divElmt.append(divTime);
    divRow.append(divElmt);

    return divRow;
    // return `
    //   <div class="row mess-user">
    //     <div class="element el-user">
    //       <div class="mess-user-body" data-type=${obj.type}>
    //         <span>${obj.content}</span>
    //       </div>
    //       <div class="time-stp">
    //         <span>${time}</span>
    //       </div>
    //     </div>
    //   </div>
    // `;
  }

  static createLink(str, arrLink) {
    const strArr = str.split(' ');
    for (let i = 0; i < strArr.length; i += 1) {
      const index = arrLink.indexOf(strArr[i]);
      if (index !== -1) {
        const newStr = `<a href="${arrLink[index]}" class="mess-link" target="_blank">${arrLink[index]}</a>`;
        strArr[i] = newStr;
      }
    }
    return strArr.join(' ');
  }
}
