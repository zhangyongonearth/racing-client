function createClient(token, type, onmessage) {
  var url = 'ws://' + location.host
  if (type !== 'screen') { // judge, team
    url += '?' + type + 'Token=' + token
  }
  var ws = new WebSocket(url)
  ws.onopen = function() {
    console.log('@open')
  }

  ws.onmessage = function(e) {
    console.log('@message')
    onmessage(e.data)
  }
  ws.onclose = function() {
    console.log('@close')
  }
  ws.onerror = function() {
    console.log('@error')
  }
  return ws
}
function Client(type) {
  this.token = undefined
  this.ws = undefined
  this.type = type
  this.login = function(token) {
    if (this.ws && this.ws.readyState === this.ws.OPEN) {
      if (this.token === token) {
        return this
      }
      this.ws.close()
    }
    this.token = token
    this.ws = createClient(token, this.type, this.onmessage)
    return this
  }
  this.quit = function() {
    this.ws.close()
  }
  this.onmessage = function(data) {
    console.log(data)
  }
  this.send = function(json) {
    if (this.type === 'team') {
      json.data.teamToken = this.token
    }
    try {
      this.ws.send(JSON.stringify(json))
    } catch (e) {
      this.login(this.token)
      this.ws.send(JSON.stringify(json))
    }
  }
}
export function Judge() {
  Client.call(this, 'judge')

  this.initRace = function(raceName, holder, teamCount, raceMode) {
    this.send({action: 'initRace', data: {raceName, holder, teamCount, raceMode}})
  }
  this.beginRace = function() {
    this.send({action: 'beginRace'})
  }
  this.nextQuestion = function() {
    this.send({action: 'nextQuestion'})
  }
  this.showAnswer = function(questionIndex) {
    this.send({action: 'showAnswer', data: {questionIndex}})
  }
  this.changeScore = function(teamToken, newValue) {
    this.send({action: 'changeScore', data: {teamToken, newValue}})
  }
  this.endRace = function() {
    this.send({action: 'endRace'})
  }
}
export function Team() {
  Client.call(this, 'team')
  this.answer = function(answer, questionIndex) {
    this.send({ action: 'answer', data: {answer, questionIndex}})
  }
  this.rename = function(newName) {
    this.send({ action: 'rename', data: {newName}})
  }
}

export function Screen() {
  Client.call(this, 'screen')
}
