interface PaypalOrderResponse {
    id: string;
    status: string;
    links: Array<{
        href: string;
        rel: string;
        method: string;
    }>;
}

interface PaypalCaptureResponse {
    id: string;
    status: string;
    payer: any; // Podés definirlo mejor si querés
    purchase_units: any[];
}
