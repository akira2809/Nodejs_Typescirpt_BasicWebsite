import axios from "axios";

interface Product {
    id: number;
    name: string;
    price: number;
}

// Make the GET request using Axios
axios.get("http://localhost:3000/products/getProducts")
    .then((response) => {
        const data: Product[] = response.data;
        const productDiv = document.getElementById("product-list");
        if (productDiv) {
            productDiv.innerHTML = ""; // Clear the existing content

            data.forEach((product) => {
                const productHTML = `
                    <h2>${product.name}</h2>
                    <h2>${product.price}</h2>
                `;
                productDiv.innerHTML += productHTML;
            });
        }
    })
    .catch((error) => {
        console.log(error);
    });
