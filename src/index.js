import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';
import { createStore } from 'redux';
import './index.css';

//redux
const CLICK = 'CLICK'
const LIMIT = 'LIMIT'

const AKeyAction = (input) => {
  return {
    type: CLICK,
    input
  }
}

const LimitAction = () => {
  return {
    type: LIMIT
  }
}

const AKeyReducer = (state = {stringDisplay: '', newNumber: '0', oldNumber: ''}, action) => {
  switch (action.type) {
    case CLICK:

      if (action.input.match(/\d/)) {
        if (state.newNumber === '0') {
          state.newNumber = ''
          state.stringDisplay = state.stringDisplay.substring(0, state.stringDisplay.length - 1)
        }
  
        if (state.newNumber === '-'
            || state.newNumber === '+' || state.newNumber === 'x'
            || state.newNumber === '/') {
          state.newNumber = ''
        }
    
        if (state.stringDisplay.includes('=')) {
          return {
            stringDisplay: action.input,
            newNumber: action.input,
            oldNumber: state.oldNumber
          }
        }

        if (state.newNumber === 'DIGIT LIMIT MET') {
          return {
            stringDisplay: state.stringDisplay,
            newNumber: state.oldNumber,
            oldNumber: state.oldNumber
          }
        } else if (state.newNumber.length < 21) {
          return {
            stringDisplay: (String)(state.stringDisplay + action.input),
            newNumber: (String)(state.newNumber + action.input),
            oldNumber: state.newNumber
          }
        }
      }

      if (action.input === '.') {
        if (state.stringDisplay.includes('=')) {
          return {
            stringDisplay: '0.',
            newNumber: '0.'
          }
        }
        if (state.stringDisplay[state.stringDisplay.length - 1] === '.') {
          state.stringDisplay = state.stringDisplay.substring(0, state.stringDisplay.length - 1)
        }
        if (state.newNumber[state.newNumber.length - 1] === '.') {
          state.newNumber = state.newNumber.substring(0, state.newNumber.length - 1)
        }

        if (state.newNumber === '-'
            || state.newNumber === '+' || state.newNumber === 'x'
            || state.newNumber === '/') {
          state.newNumber = '0'
          state.stringDisplay = (String)(state.stringDisplay + '0')
        }

        if (state.stringDisplay === '') {
          state.stringDisplay = '0'
          state.newNumber = '0'
        }

        if (state.oldNumber.includes('.')) {
          return state
        }

        return {
          stringDisplay: (String)(state.stringDisplay + '.'),
          newNumber: (String)(state.newNumber + '.'),
          oldNumber: state.oldNumber
        }
      }

      if (action.input === '=') {
        if (!state.stringDisplay.includes('=')) {
          if (state.stringDisplay[state.stringDisplay.length - 1].match(/[^\d\w.]/)) {
            state.stringDisplay = state.stringDisplay.substring(0, state.stringDisplay.length - 1)
          }

          if (state.stringDisplay[0].match(/\d/) 
            || ((state.stringDisplay[0] === '-' || state.stringDisplay[0] === '+') 
            && state.stringDisplay[1].match(/\d/))) 
          {

            let string = state.stringDisplay

            string = string.replace('⋅', '*')
            let numbers;
            numbers = string.replace(/[^-\d/*+.]/g, '')
            const result = eval(numbers)
            return {
              stringDisplay: (String)(state.stringDisplay + "=" + result),
              newNumber: result,
              oldNumber: state.oldNumber
            }
          } else if (state.stringDisplay.includes('Infinity⋅0')) {
            return {
              stringDisplay: (String)(state.stringDisplay + "=Nan"),
              newNumber: 'Nan',
              oldNumber: state.oldNumber
            }
          } else if (state.stringDisplay.includes('Infinity')) {
            return {
              stringDisplay: (String)(state.stringDisplay + "=Infinity"),
              newNumber: 'Infinity',
              oldNumber: state.oldNumber
            }
          } else if (state.stringDisplay.includes('Nan')) {
            return {
              stringDisplay: (String)(state.stringDisplay + "=Nan"),
              newNumber: 'Nan',
              oldNumber: state.oldNumber
            }
          } else return state
        } else {
          return state
        }
      }

      if (action.input === '+') {
        if(state.stringDisplay !== '') {
          while (state.stringDisplay[state.stringDisplay.length - 1].match(/[^\d.]/)) {
            state.stringDisplay = state.stringDisplay.substring(0, state.stringDisplay.length - 1)
          }

          if (state.stringDisplay.includes('=')) state.stringDisplay = state.newNumber
        }
        state.oldNumber = state.newNumber
        return {
          stringDisplay: (String)(state.stringDisplay + "+"),
          newNumber: '+',
          oldNumber: state.oldNumber
        }
      }

      if (action.input === '-') {
        if(state.stringDisplay !== '') {
          if (state.stringDisplay[0].match(/[^\d.]/)) {
            state.stringDisplay = state.stringDisplay.substring(0, state.stringDisplay.length - 1)
          }

          if (state.stringDisplay.includes('=')) state.stringDisplay = state.newNumber
        }
        state.oldNumber = state.newNumber
        return {
          stringDisplay: (String)(state.stringDisplay + "-"),
          newNumber: '-',
          oldNumber: state.oldNumber
        }
      }

      if (action.input === '/') {
        if(state.stringDisplay !== '') {
          while (state.stringDisplay[state.stringDisplay.length - 1].match(/[^\d.]/)) {
            state.stringDisplay = state.stringDisplay.substring(0, state.stringDisplay.length - 1)
          }
          if (state.stringDisplay.includes('=')) state.stringDisplay = state.newNumber
        }
        state.oldNumber = state.newNumber
        return {
          stringDisplay: (String)(state.stringDisplay + "/"),
          newNumber: '/',
          oldNumber: state.oldNumber
        }
      }

      if (action.input === 'x') {
        if(state.stringDisplay !== '') {
          while (state.stringDisplay[state.stringDisplay.length - 1].match(/[^\d.]/)) {
            state.stringDisplay = state.stringDisplay.substring(0, state.stringDisplay.length - 1)
          }
          if (state.stringDisplay.includes('=')) state.stringDisplay = state.newNumber
        }
        state.oldNumber = state.newNumber
        return {
          stringDisplay: (String)(state.stringDisplay + "⋅"),
          newNumber: 'x',
          oldNumber: state.oldNumber
        }
      }

      if (action.input === 'AC') {
        return {stringDisplay: '', newNumber: '0', oldNumber: ''}
      }
      break;
    case LIMIT: 
      state.oldNumber = state.newNumber
      return {
        stringDisplay: state.stringDisplay,
        newNumber: 'DIGIT LIMIT MET',
        oldNumber: state.oldNumber
      }
    default:
      return state
      break;
  }
}

const store = createStore(AKeyReducer)
console.log(store.getState())


//react

class AKey extends React.Component {
  constructor(props) {
    super(props)

    this.handleCick = this.handleClick.bind(this)
  }

  handleClick(event) {
    if (store.getState().newNumber.length > 20) {
      store.dispatch(LimitAction())
      setTimeout(() => store.dispatch(AKeyAction(event.target.value)), 1000)
    } else store.dispatch(AKeyAction(event.target.value))
    
  }

  render() {
    console.log("re-reder-akey")
    return (
      <button className='akey' id={this.props.id} onClick={this.handleClick} value={this.props.number}>{this.props.number}</button>
    )
  }
}

class Symbol extends React.Component {
  constructor(props) {
    super(props)
    this.handleCick = this.handleCick.bind(this)
  }

  handleCick(e) {
    store.dispatch(AKeyAction(e.target.value))
  }

  render() {
    console.log("re-reder-symbol")
    return (
      <button className='symbol' id={this.props.id} onClick={this.handleCick} value={this.props.value}>{this.props.value}</button>
    )
    
  }
}

function KeyBoard() {
  return (
    <div>
      <Symbol id='clear' value='AC' />
      <Symbol id='devide' value={'/'}/>
      <Symbol id='multiply' value={'x'}/>
      <AKey id='seven' number={7} />
      <AKey id='eight' number={8} />
      <AKey id='nine' number={9} />
      <Symbol id='subtract' value={'-'}/>
      <AKey id='four' number={4} />
      <AKey id='five' number={5} />
      <AKey id='six' number={6} />
      <Symbol id='add' value={'+'}/>
      <AKey id='one' number={1} />
      <AKey id='two' number={2} />
      <AKey id='three' number={3} />
      <Symbol id='equals' value={'='}/>
      <AKey id='zero' number={0} />
      <Symbol id='decimal' value={'.'}/>
    </div>
  )
}

class Display extends React.Component {
  render() {
    console.log("re-render-screen")
    return (
      <div>
        <div className='formulaScreen'>{this.props.stringDisplay}</div>
        <div className='outputScreen' id='display'>{this.props.newNumber}</div>
      </div>
      
    )
  }
}

//react-redux
const mapStateToProps = (state) => {
  return state
}

const mapDispatchToProps = (dispatch) => {
  return {
    clickAKey: (number) => {dispatch(AKeyAction(number))}
  }
}

const DisplayScreen = connect(mapStateToProps, mapDispatchToProps)(Display)

function App() {
  return (
    <div>
      <div id='hiha'>HIHA</div>
      <div className='calculator'>
        <Provider store={store}>
          <DisplayScreen />
        </Provider>
        <KeyBoard />
      </div>
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
