exports.fibApi = ({math, app}) => {
    app.get('/fib', (req, res) => {
        let a = 0, b = 1, f = 1
        for (let i = 2; i <= 10000; i++) {
            f = math.add(math.bignumber(a), math.bignumber(b))
            a = b
            b = f
        }
        res.send(`${math.format(f, {notation: 'fixed'})}`)
    })
}
