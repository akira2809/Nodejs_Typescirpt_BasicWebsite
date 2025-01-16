interface Product {
    id: number;
    name: string;
    price: number;
}

fetch("http://localhost:3000/products/getProducts")
    .then((response) => response.json())
    .then((data: Product[]) => {
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
