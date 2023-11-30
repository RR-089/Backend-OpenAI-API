const handleError = (error, res) => {
    console.error(error);
    
    if (error.response) {
        console.error("Error:", error.response.status);
        console.error("Status Text:", error.response.statusText);
        
        if(error.response.status === 401){
            res.status(401).json({ error: "Free AI API token/key is expired or empty" });
        }
    }
    

    res.status(500).json({ error: "An error occurred" });

}

export { handleError };