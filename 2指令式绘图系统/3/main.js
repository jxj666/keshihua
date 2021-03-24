/*
 * @LastEditTime: 2021-03-25 00:27:58
 * @LastEditors: jinxiaojian
 */


const dataSource = 'https://s5.ssl.qhres.com/static/b0695e2dd30daa64.json';
(async function () {
  const data = await (await fetch(dataSource)).json();
  console.log(data)
}());