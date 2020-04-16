setTimeout(() => console.log('6 set timeout'), 0)

Promise.resolve().then(() => {
  console.log('1 promise resolved')
  Promise.resolve().then(() => {
    console.log('2 promise resolved')
    Promise.resolve().then(() => {
      console.log('4 promise resolved')
    })
  })
  process.nextTick(() => console.log('5 next tick'))
  Promise.resolve().then(() => {
    console.log('3 promise resolved')
  })
})

console.log('0')
