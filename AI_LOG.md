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
