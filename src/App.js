import './App.css';
import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {subjects: [], exams: [], newSubjectText: '', newExamText: '', asked: {}};
  }
  render(){
    return (
      <div className="App">
        <header className="App-header">
          <h1>Exam Data to CSV</h1>
        </header>
        <div>
          <h2>科目の追加</h2>
          <form onSubmit={this.addSubject}>
            <input
              onChange={this.changeNewSubjectText}
              value={this.state.newSubjectText}
            />
            <button>add</button>
          </form>
          <BulletList items={this.state.subjects} />
        </div>
        <div>
          <h2>試験の追加</h2>
          <form onSubmit={this.addExam}>
            <input
              onChange={this.changeNewExamText}
              value={this.state.newExamText}
            />
            <button>add</button>
          </form>
          <BulletList items={this.state.exams} />
        </div>
        <div>
          <h2>出題有無の選択</h2>
          <div className="Asked-table">
            <table>
              <thead>
                <tr>
                  <th key='#'>#</th>
                  {
                    this.state.subjects.map((subject) => (
                      <th key={subject}>{subject}</th>
                    ))
                  }
                </tr>
              </thead>
              <tbody>
                {
                  this.state.exams.map((exam) => (
                    <tr key={exam}>
                      <th key={exam}>{exam}</th>
                      {this.state.subjects.map((subject) => (
                        <td key={exam+','+subject}>
                          <input
                            type="checkbox"
                            onChange={this.onChangeAsked.bind(this,exam,subject)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <ExportCsv subjects={this.state.subjects} exams={this.state.exams} asked={this.state.asked}/>
        </div>
      </div>
    );  
  }
  changeNewSubjectText = (e) => {
    this.setState({newSubjectText: e.target.value})
  }
  addSubject = (e) => {
    e.preventDefault();
    this.setState(state => ({
      subjects: state.subjects.concat(this.state.newSubjectText),
      newSubjectText: '',
    }));
  }
  changeNewExamText = (e) => {
    this.setState({newExamText: e.target.value})
  }
  addExam = (e) => {
    e.preventDefault();
    this.setState(state => ({
      exams: state.exams.concat(this.state.newExamText),
      newExamText: '',
    }));
  }
  onChangeAsked = (exam,subject,e) => {
    let newAsked = {}
    Object.assign(newAsked, this.state.asked)
    if(newAsked[exam] === undefined)newAsked[exam] = {}
    newAsked[exam][subject] = e.target.checked
    this.setState(state => ({
      asked: newAsked
    }))
  }
}

class ExportCsv extends React.Component{
  render(){
    return (
      <button onClick={this.onClick}>ダウンロード</button>
    )
  }
  onClick = (e) => {
    const {subjects, exams, asked} = this.props 
    let result = ''
    for(let subject of subjects){
      result += ',' + subject
    }
    result += '\n'
    for(let exam of exams){
      result += exam
      if(asked[exam] === undefined)asked[exam] = {}
      for(let subject of subjects){
        result += ',' + (asked[exam][subject] ? '1' : '0')
      }
      result += '\n'
    }
    const blob = new Blob([result], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "examdata.csv"
    a.click();
    a.remove();
  }
}

class BulletList extends React.Component{
  render() {
    return (
      <div className="Bullet-list">
        <ul>
          {this.props.items.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    )
  }
}

export default App;
