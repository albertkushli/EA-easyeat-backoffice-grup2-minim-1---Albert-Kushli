# AI_LOG.md

**Eina:** Antigravity (Google DeepMind)
**Model:** Gemini 3 Flash

---

### Consulta 1: Definició de la lògica de dades (Service i Model)
**Pregunta:** Com crear l'estructura de dades per als recursos i la comunicació amb l'API.
**Prompt:** "Implementar un servicio que permita vincular material complementario (URLs de manuales, vídeos, webs) a los restaurantes, con un modelo que incluya tipo, url y descripción."
**Incoherències:** La IA va proposar un servei que usava rutes genèriques (`/resources`) en comptes de seguir el patró del backend del projecte que penja de `/recursos` i requereix el `restaurant_id` en el body per a la creació.
**Solució:** S'ha ajustat manualment la `baseUrl` del servei per usar `environment.apiUrl` i s'han definit els mètodes `addItem` i `removeItem` per coincidir exactament amb els endpoints del backend de EasyEat.

---

### Consulta 2: Integració arquitectònica a la UI (Refactoring)
**Pregunta:** Com integrar la gestió de recursos respectant el patró de disseny "monolític" del projecte.
**Prompt:** "vale ahora me funciona perfecto pero me pareceria mas correcto que el resoruce list no fuera una carpeta aparte como ahora sino que estuvese dentro de restaurant list que es como estan todos los demas CRUDS que hay dentro de restaurant podrias hacerlo?"
**Incoherències:** La IA va intentar mantenir un component independent (`<app-resource-list>`) pensant en modularitat, però això trencava la consistència amb altres seccions com *Rewards* o *Visits* que ja funcionaven dins del mateix fitxer `restaurant-list.ts`.
**Solució:** S'ha mogut la lògica dels Observables i els formularis reactius a la classe `RestaurantList`. S'han creat diccionaris d'estat per gestionar múltiples llistes de recursos simultànies i s'ha integrat l'HTML dins del template principal amb els estils compartits del projecte.

---

### Consulta 3: Implementació del mètode d'edició (Update)
**Pregunta:** Afegir la funcionalitat per editar un recurs existent a la llista.
**Prompt:** "el resources esta perfecto pero solo utilizamos 2 metodos de la api post i eliminar me faltaria uno mas como por ejemplo update"
**Incoherències:** La IA no estava tenint en compte que al ser un PATCH havia de mantenir les dades en el formulari no com en el PUT que apareix el formulari buit i has de tornar a escriure totes les dades. A més, no estava tenint en compte que el PATCH només actualitza les dades que s'envien no totes les dades. Per tant, no calia enviar totes les dades en el PATCH.
**Solució:** S'ha creat una ruta PATCH al backend per actualitzar ítems individuals i s'ha implementat un formulari reactiu d'edició al frontend que substitueix la fila del recurs quan l'usuari clica a la icona del llapis gestionant l'estat d'edició de forma independent per cada restaurant.
