/*
 * @LastEditTime: 2021-05-21 01:02:09
 * @LastEditors: jinxiaojian
 */
let obj = {
  name: 'root',
}
var i = 0
let arr = ['smss', 'csrss', 'winlogon', 'services', 'lsass', 'svchost', 'explorer', 'internat', 'mstask', 'regsvc', 'winmgmt', 'inetinfo', 'tlntsvr', 'tftpd', 'termsrv', 'dns', 'tcpsvcs', 'ismserv', 'ups', 'wins', 'llssrv', 'ntfrs', 'RsSub', 'locator', 'lserver', 'dfssvc', 'clipsrv', 'msdtc', 'faxsvc', 'cisvc']

function getData (obj) {
  i++;
  if (i > 500) return null
  obj.name = arr[Math.floor(Math.random() * arr.length)]

  if (Math.random() > 0.5) {
    obj.children = []
    let key = Math.random() * 20 + 1
    for (let j = 0; j < key; j++) {
      let childObj = getData({})
      if (childObj) obj.children.push(childObj)
    }
  } else {
    obj.value = 1
  }
  return obj
}
getData(obj)
JSON.stringify(obj)