import React from 'react'
import axios from 'axios'

const URL = 'http://localhost:9000/api/todos'

export default class App extends React.Component {
  
  state = {
    todos: [],
    error: '',
    todoNameInput: '',
    displayCompleted: false,
  }

 
 
  onTodoNameInputChange = evt => {
    const { value } = evt.target
   this.setState({...this.state, todoNameInput:value })
  }

  resetForm = () => this.setState({...this.state, todoNameInput: ''})
  
  setAxiosResponseError = err => {   this.setState({...this.state, error: err.response.data.message })

  }

  postNewTodo = () => {
    axios.post(URL, { name:this.state.todoNameInput })
      .then(res => {
      this.setState({...this.state, todos: this.state.todos.concat(res.data.data)})
        this.resetForm()
      })
      .catch(this.setAxiosResponseError)
  }
   
  onTodoFormSubmit = evt => {
  evt.preventDefault()
  this.postNewTodo()
  }
    
  fetchAlltodos = () => {
    axios.get(URL)
      .then(res => {
        this.setState({ ...this.state, todos: res.data.data })
        console.log(res)
      })
      .catch(err => {
        this.setState({ ...this.state, error: err.response.data.message })
        console.log(err)
    })
  } 
  toggleCompleted = id => () => {
    axios.patch(`${URL}/${id}`)
      .then(res => {
        this.setState({
          ...this.state, todos: this.state.todos.map(td => {
            if (td.id !== id) return td
            return res.data.data
          }
            )
        })
      })
    .catch(this.setAxiosResponseError)
  } 
    
  toggleDisplayCompleted = () => {
  this.setState({...this.state, displayCompleted: !this.state.displayCompleted})
}

  componentDidMount() {
    this.fetchAlltodos()  }
  render() {
    return (
      <div>
        <div id="error"> Error {this.state.error}</div>
        <div id="todos">
          <h2> Todos: </h2>
          {
            this.state.todos.reduce((acc, td) => {
              if (this.state.displayCompleted || !td.completed) return acc.concat(
                <div onClick={this.toggleCompleted(td.id)} key={td.id}>{td.name} {td.completed ? ' √' : ''}</div>)
            return acc
            }, [])
          } 
        </div>
        <form id="todoForm" onSubmit={this.onTodoFormSubmit}>
          <input value={this.state.todoNameInput} onChange={this.onTodoNameInputChange} type='text' placeholder='Type todo here'></input>
          <input type='submit'></input>
          <button onClick={this.toggleDisplayCompleted} > {this.state.displayCompleted ? 'Hide' : 'Show'} Component</button>

        </form>
      </div>
    )
  }
}
