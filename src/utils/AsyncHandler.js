const AsyncHandler = (requestHandeler) => async (req , res , next) => {

    try{
        await requestHandeler(req , res , next);

    }catch(err){

        next(err);
    }
}

export {AsyncHandler}