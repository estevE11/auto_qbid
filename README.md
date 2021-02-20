# Auto qBid

### Solo estable en windows

## Instalación

Ejecuta `npm install`

Crea un archivo `creds.json` con tus credenciales de qBid:

```
{
    "user": "*",
    "pass": "*"
}
```

Ejectuta `npm start` para iniciar el bot.

## Configuración

La configuración del bot se encuentra el el archivo `bot_config.json`. Hay un ejemplo ya creado

Campo|Descripcion
:---|:----
start_date|Fecha de inicio separada por `-`
duration|El numero de dias que se van a rellenar
snippets|Plantillas escogidas aleatoriamente para rellenar los dias

#### Definir los selects de una plantilla

```
{
    "id": "12",
    "val": "1.0"
}
```

![alt text](https://lh3.googleusercontent.com/fife/ABSRlIqJZSrJ2PtYgmwHmSM-yPQ-Ks1xf6Fv1lG1ILMTz6LEbhdqemZw-Nu2P-3NeSxECzdC4v0tCx47QsTJDR1ZIRcJPx7divNsuIVPf8WnYqCaUwUFC5r-kSshxQvCNQLmyBYbygEfssKE6plwwQYHMlBTnu3eBaBBoiBjUQcIEgq8_ejIP1XL3G9uYfkDVNeQ5lX1o4ByHovR_HEF_s4FNXBqaQM09QRe9XqaKhw1wrjKXA5p7M-pkIlP3FXQpLT_XzFtoOnSqG2NMqes8U695ZSehaYDx2KhkC0tyAg5ao4QB1tp6EvgMWnE6Yrn-j2og0-uUFO9bzGTRm-a321fFjlO5lobq6Kq8t2nw05bZkUxQkYF9w3AsYDjz2lCCeaV97jDzBMgIE1ytNqA7Mpzshd1X9Vti-_RcDds1B9DiXLSZA3eYvbg0MDzT80yUPIb-ZsadOpxVdeEX5JUJPrt80QDzvLJHYqKHxzkoIx62BOROhJOfbTsjcuqEjh19EL1-29gTGWZU1bkUM6_2VCvGyKhlj11OM7eR3v5kA2LmHmsd-6gvsC1kU6-G1HMSY8N_ISy0kTbE0DA1VDkIFI3p1cAP0jaDDCT-ssZ9qrHYOKN1RH02S6tWjbujKpNHSP9GEdq4ht0chQmPdrUofvWsTaewjEgak1kfnp7_yHznvkpz5IVX1TLLYVsTvzov-5mPcf7Y7rZY5gvztDRa4Pq6I4SBwS5S1Y8gA=w320-h200-k-ft)

Donde `id` son los dos ultimos digitos de la id y `val` es el value de la opcion que quieras. Para encontrar estos valores: `click derecho > inspecionar elemento` en el select que quieras. 
