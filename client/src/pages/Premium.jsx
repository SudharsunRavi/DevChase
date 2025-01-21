const Premium = () => {
    const handlePayment = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/payment/order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            const data = await response.json();
            //console.log(data);

            const options = {
                key: 'rzp_test_Ii6w9bSjI0CWhh',
                amount: data.amount,
                currency: data.currency,
                name: 'Dev Chase',
                description: 'Get your premium today',
                order_id: data.orderId, 
                // callback_url: 'http://localhost:3000/payment-success',
                prefill: {
                  name: data?.notes?.username,
                  email: data?.notes?.email,
                },
                theme: {
                  color: '#F37254'
                },
              };
        
              const rzp = new window.Razorpay(options);
              rzp.open();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="card bg-base-300 text-slate-200 w-96">
                <div className="card-body">
                    <h2 className="card-title mb-6">Buy premium plan</h2>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magnam ea soluta nesciunt maiores fugiat? Eveniet odit perspiciatis aspernatur amet ipsam, blanditiis quisquam mollitia voluptatibus quasi soluta illo enim laudantium consequuntur!</p>
                    <div className="card-actions justify-end">
                    <button className="btn" onClick={handlePayment}>Buy Now</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Premium;