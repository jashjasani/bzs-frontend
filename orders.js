document.addEventListener("DOMContentLoaded", async () => {
    window.printPDF = (event) => {
        fetch(
            `https://bildzeitschrift.netlify.app/.netlify/functions/orders?id=${event.target.attributes.token.value}`,
            {
                method: "GET",
                headers: {
                    Authorization: sessionStorage.getItem("auth"),
                },
            }
        )
            .then((res) => res.json())
            .then((order) => {
                function printContent() {
                    window.print();
                }
                const printWindow = window.open("", "");
                printWindow.document.write(order.HTML);

                if (
                    screen.orientation.type != "portrait-primary" &&
                    screen.orientation.angle != 90
                ) {
                    printWindow.document.close();
                    printWindow.focus();
                    printWindow.print();
                    printWindow.close();
                } else {
                    printWindow.open();
                }
            });
    };
    const grid = document.querySelector(".head-wrap");
    const res = await fetch(
        "https://bildzeitschrift.netlify.app/.netlify/functions/orders",
        {
            method: "GET",
            headers: {
                Authorization: sessionStorage.getItem("auth"),
            },
        }
    );

    if (res.status == 200) {
        const orders = await res.json();
        if (
            orders.length > 0 &&
            screen.orientation.type != "portrait-primary" &&
            screen.orientation.angle != 90
        ) {
            let string = `  <div class="w-layout-grid orders-grid" style="display:grid;">
                            <div id="w-node-_971481b0-2c9d-a946-d6eb-5dd17fdaac3e-fca4f9b2" class="orders-grid-div"><div class="orders-grid-txt">Bestelldatum</div></div>
                            <div id="w-node-_618b6310-8d83-799a-e6c0-c6ac7aaff393-fca4f9b2" class="orders-grid-div is-details"><div class="orders-grid-txt">Rechnungsdetails</div></div>
                            <div id="w-node-_93c9560f-7003-8a75-1c85-607c97118f41-fca4f9b2" class="orders-grid-div"><div class="orders-grid-txt">Summe</div></div>
                            <div id="w-node-b037d4e7-0163-9364-fac1-082f04300f00-fca4f9b2" class="orders-grid-div is-last"><div class="orders-grid-txt">Rechnung</div></div>`;

            for (let i = 0; i < orders.length; i++) {
                const date = new Date(orders[i].date);

                string += `<div id="w-node-_3cc087e9-0c02-0309-866d-d4426da106df-fca4f9b2" class="orders-grid-div ${
                    i == orders.length - 1 ? "is-bottom" : ""
                }"><div class="orders-grid-txt">${date
                    .getDate()
                    .toString()
                    .padStart(2, "0")} ${date.toLocaleString("de-DE", {
                    month: "long",
                })} ${date.getFullYear()}</div></div>`;
                string += `<div id="w-node-e2dc63ca-cfb7-5742-9a08-db5b4d56f4c3-fca4f9b2" class="orders-grid-div ${
                    i == orders.length - 1 ? "is-bottom" : ""
                }"><div class="orders-grid-txt">${
                    orders[i].invoice_details
                }</div></div>`;
                string += `<div id="w-node-_124d6d36-72fc-24b0-c5f3-94fb8f36a298-fca4f9b2" class="orders-grid-div ${
                    i == orders.length - 1 ? "is-bottom" : ""
                }"><div class="orders-grid-txt">€ ${
                    orders[i].total
                }</div></div>`;
                string += `<div id="w-node-_160f0ee6-77f7-6901-1803-eb60995699de-fca4f9b2" class="orders-grid-div is-last ${
                    i == orders.length - 1 ? "is-bottom" : ""
                }"><a href="#" token=${
                    orders[i].order_id
                } class="orders-grid-txt is-link" onclick="printPDF(event)">Rechnung herunterladen</a></div>`;
            }
            string += "</div>";
            document.querySelector(".loading").style.display = "none";
            grid.insertAdjacentHTML("afterend", string);
        } else if (
            orders.length > 0 &&
            !(
                screen.orientation.type != "portrait-primary" &&
                screen.orientation.angle != 90
            )
        ) {
            let string = `  <div class="w-layout-grid orders-grid" style="display:grid;">
            <div id="w-node-_971481b0-2c9d-a946-d6eb-5dd17fdaac3e-fca4f9b2" class="orders-grid-div"><div class="orders-grid-txt">Bestelldatum</div></div>
            <div id="w-node-b037d4e7-0163-9364-fac1-082f04300f00-fca4f9b2" class="orders-grid-div is-last"><div class="orders-grid-txt">Rechnung</div></div>`;

            for (let i = 0; i < orders.length; i++) {
                const date = new Date(orders[i].date);

                string += `<div id="w-node-_3cc087e9-0c02-0309-866d-d4426da106df-fca4f9b2" class="orders-grid-div ${
                    i == orders.length - 1 ? "is-bottom" : ""
                }"><div class="orders-grid-txt">${date
                    .getDate()
                    .toString()
                    .padStart(2, "0")} ${date.toLocaleString("de-DE", {
                    month: "long",
                })} ${date.getFullYear()}</div></div>`;
                string += `<div id="w-node-_160f0ee6-77f7-6901-1803-eb60995699de-fca4f9b2" class="orders-grid-div is-last ${
                    i == orders.length - 1 ? "is-bottom" : ""
                }"><a href="#" token=${
                    orders[i].order_id
                } class="orders-grid-txt is-link" onclick="printPDF(event)">Rechnung herunterladen</a></div>`;
            }
            string += "</div>";
            document.querySelector(".loading").style.display = "none";
            grid.insertAdjacentHTML("afterend", string);
        } else {
            document.querySelector(".loading-data-img").style.display = "none";
            document.querySelector(".product-title").innerText =
                "keine Befehle";
        }
    }
});
