import type { Express, Request, Response } from "express";
import { Duffel } from "@duffel/api";

const MARKUP_PERCENT = 8;

const duffelLive = new Duffel({
  token: process.env.DUFFEL_API_KEY_LIVE || "",
});

const duffelTest = new Duffel({
  token: process.env.DUFFEL_API_KEY_TEST || "",
});

function applyMarkup(amount: string): string {
  const base = parseFloat(amount);
  const marked = base * (1 + MARKUP_PERCENT / 100);
  return marked.toFixed(2);
}

export function registerDuffelRoutes(app: Express) {

  app.get("/api/duffel/airports", async (req: Request, res: Response) => {
    try {
      const query = (req.query.q as string || "").trim();
      if (query.length < 2) {
        return res.json([]);
      }

      const response = await duffelLive.suggestions.list({ query });
      const places = (response.data || [])
        .filter((s: any) => s.type === "airport" || s.type === "city")
        .slice(0, 10)
        .map((s: any) => ({
          iata_code: s.iata_code,
          name: s.name,
          city_name: s.city_name || s.name,
          type: s.type,
        }));
      res.json(places);
    } catch (error: any) {
      console.error("Airport search error:", error?.errors || error?.message);
      res.status(500).json({ error: "Error buscando aeropuertos" });
    }
  });

  app.post("/api/duffel/flights/search", async (req: Request, res: Response) => {
    try {
      const { origin, destination, departure_date, return_date, passengers, cabin_class, max_connections } = req.body;

      if (!origin || !destination || !departure_date) {
        return res.status(400).json({ error: "Origen, destino y fecha son requeridos" });
      }

      const slices: any[] = [
        { origin, destination, departure_date },
      ];

      if (return_date) {
        slices.push({ origin: destination, destination: origin, departure_date: return_date });
      }

      const passengerList: any[] = [];
      const adultCount = passengers?.adults || 1;
      const childCount = passengers?.children || 0;
      const infantCount = passengers?.infants || 0;

      for (let i = 0; i < adultCount; i++) passengerList.push({ type: "adult" });
      for (let i = 0; i < childCount; i++) passengerList.push({ type: "child", age: 10 });
      for (let i = 0; i < infantCount; i++) passengerList.push({ type: "infant_without_seat", age: 1 });

      const offerRequest = await duffelLive.offerRequests.create({
        slices,
        passengers: passengerList,
        cabin_class: cabin_class || "economy",
        max_connections: max_connections !== undefined ? max_connections : undefined,
        return_offers: true,
      } as any);

      const offers = ((offerRequest.data as any).offers || [])
        .slice(0, 30)
        .map((offer: any) => ({
          id: offer.id,
          total_amount: applyMarkup(offer.total_amount),
          base_amount: offer.base_amount,
          total_currency: offer.total_currency,
          owner: {
            name: offer.owner?.name,
            logo_symbol_url: offer.owner?.logo_symbol_url,
            iata_code: offer.owner?.iata_code,
          },
          slices: offer.slices?.map((slice: any) => ({
            origin: {
              name: slice.origin?.name,
              iata_code: slice.origin?.iata_code,
              city_name: slice.origin?.city_name,
            },
            destination: {
              name: slice.destination?.name,
              iata_code: slice.destination?.iata_code,
              city_name: slice.destination?.city_name,
            },
            duration: slice.duration,
            segments: slice.segments?.map((seg: any) => ({
              origin: { name: seg.origin?.name, iata_code: seg.origin?.iata_code },
              destination: { name: seg.destination?.name, iata_code: seg.destination?.iata_code },
              departing_at: seg.departing_at,
              arriving_at: seg.arriving_at,
              duration: seg.duration,
              marketing_carrier: {
                name: seg.marketing_carrier?.name,
                logo_symbol_url: seg.marketing_carrier?.logo_symbol_url,
                iata_code: seg.marketing_carrier?.iata_code,
              },
              marketing_carrier_flight_number: seg.marketing_carrier_flight_number,
              aircraft: seg.aircraft,
            })),
          })),
          passengers: offer.passengers?.length,
          cabin_class: offer.slices?.[0]?.segments?.[0]?.passengers?.[0]?.cabin_class_marketing_name,
          conditions: {
            refund_before_departure: offer.conditions?.refund_before_departure,
            change_before_departure: offer.conditions?.change_before_departure,
          },
          expires_at: offer.expires_at,
        }));

      offers.sort((a: any, b: any) => parseFloat(a.total_amount) - parseFloat(b.total_amount));

      res.json({
        offer_request_id: offerRequest.data.id,
        offers,
        total_offers: offers.length,
      });
    } catch (error: any) {
      console.error("Flight search error:", error?.errors || error?.message);
      const msg = error?.errors?.[0]?.message || "Error buscando vuelos";
      res.status(500).json({ error: msg });
    }
  });

  app.get("/api/duffel/flights/offer/:id", async (req: Request, res: Response) => {
    try {
      const offer = await duffelLive.offers.get(req.params.id, { return_available_services: true });
      const data = offer.data;

      res.json({
        id: data.id,
        total_amount: applyMarkup(data.total_amount),
        total_currency: data.total_currency,
        owner: data.owner,
        slices: data.slices,
        passengers: data.passengers,
        conditions: data.conditions,
        available_services: data.available_services,
        expires_at: data.expires_at,
        payment_requirements: data.payment_requirements,
      });
    } catch (error: any) {
      console.error("Offer detail error:", error?.errors || error?.message);
      res.status(500).json({ error: "Error obteniendo detalles de la oferta" });
    }
  });

  app.post("/api/duffel/stays/search", async (req: Request, res: Response) => {
    try {
      const { location, check_in_date, check_out_date, rooms, guests } = req.body;

      if (!location || !check_in_date || !check_out_date) {
        return res.status(400).json({ error: "Ubicación, check-in y check-out son requeridos" });
      }

      const searchParams: any = {
        check_in_date,
        check_out_date,
        rooms: rooms || 1,
        guests: guests || [{ type: "adult" }],
        location: {
          geographic_coordinates: location.coordinates
            ? { latitude: location.coordinates.lat, longitude: location.coordinates.lng }
            : undefined,
          radius: 10,
        },
      };

      try {
        const searchResult = await (duffelTest as any).stays.search(searchParams);
        const results = (searchResult?.data?.results || []).slice(0, 20).map((r: any) => ({
          id: r.id,
          accommodation: {
            name: r.accommodation?.name,
            description: r.accommodation?.description,
            photos: r.accommodation?.photos?.slice(0, 5),
            rating: r.accommodation?.rating,
            location: r.accommodation?.location,
          },
          cheapest_rate_total_amount: r.cheapest_rate_total_amount
            ? applyMarkup(r.cheapest_rate_total_amount)
            : null,
          cheapest_rate_currency: r.cheapest_rate_currency,
        }));

        res.json({ results, total: results.length });
      } catch (staysError: any) {
        console.error("Stays API error:", staysError?.errors || staysError?.message);
        res.json({
          results: [],
          total: 0,
          message: "Hoteles en modo test - contacta a Duffel para activar Stays API si no muestra resultados.",
        });
      }
    } catch (error: any) {
      console.error("Hotel search error:", error?.errors || error?.message);
      res.status(500).json({ error: "Error buscando hoteles" });
    }
  });

  app.get("/api/duffel/config", (_req: Request, res: Response) => {
    res.json({
      flights_enabled: !!process.env.DUFFEL_API_KEY_LIVE,
      hotels_enabled: !!process.env.DUFFEL_API_KEY_TEST,
      markup_percent: MARKUP_PERCENT,
    });
  });
}
