export async function homePage(req , res ) {
    res.send({
        status: "success",
        message: "Home page"
    })
}

export async function slowPage(req , res ) {

    try {
        let result = 0;
        for (let i = 0; i < 5000000000; i++) {
            result = result +  i;
        }

        return res.status(200).send({
            status: "success",
            sum : result,
            message: "slow page"
        })
    }
    catch (error) {
        return res.status(404).send({ error })
    }

}
