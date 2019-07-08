function createA(href, text) {
  var a = document.createElement('a')
  a.href = href
  a.text = text
  document.getElementById('app').appendChild(a)
  document.getElementById('app').appendChild(document.createElement('br'))
}
createA('xuanshou.html', '选手页')
createA('screen.html', '大屏幕页')
createA('zhuchi.html', '主持页')
