import { NextRequest, NextResponse } from "next/server";

const SCHOOLS = [
  { id: "1", name: "Eton College", city: "Windsor", country: "United Kingdom", domain: "etoncollege.com" },
  { id: "2", name: "Harrow School", city: "London", country: "United Kingdom", domain: "harrowschool.org.uk" },
  { id: "3", name: "Winchester College", city: "Winchester", country: "United Kingdom", domain: "winchestercollege.org" },
  { id: "4", name: "Rugby School", city: "Rugby", country: "United Kingdom", domain: "rugbyschool.co.uk" },
  { id: "5", name: "Cheltenham Ladies' College", city: "Cheltenham", country: "United Kingdom", domain: "cheltladiescollege.org" },
  { id: "6", name: "Marlborough College", city: "Marlborough", country: "United Kingdom", domain: "marlboroughcollege.org" },
  { id: "7", name: "St Paul's School", city: "London", country: "United Kingdom", domain: "stpaulsschool.org.uk" },
  { id: "8", name: "Westminster School", city: "London", country: "United Kingdom", domain: "westminster.org.uk" },
  { id: "9", name: "Charterhouse School", city: "Godalming", country: "United Kingdom", domain: "charterhouse.org.uk" },
  { id: "10", name: "Shrewsbury School", city: "Shrewsbury", country: "United Kingdom", domain: "shrewsbury.org.uk" },
  { id: "11", name: "Dulwich College", city: "London", country: "United Kingdom", domain: "dulwich.org.uk" },
  { id: "12", name: "King's College School", city: "London", country: "United Kingdom", domain: "kcs.org.uk" },
  { id: "13", name: "Tonbridge School", city: "Tonbridge", country: "United Kingdom", domain: "tonbridge-school.co.uk" },
  { id: "14", name: "Radley College", city: "Abingdon", country: "United Kingdom", domain: "radley.org.uk" },
  { id: "15", name: "Uppingham School", city: "Uppingham", country: "United Kingdom", domain: "uppingham.co.uk" },
  { id: "16", name: "Oakham School", city: "Oakham", country: "United Kingdom", domain: "oakham.rutland.sch.uk" },
  { id: "17", name: "Repton School", city: "Derby", country: "United Kingdom", domain: "repton.org.uk" },
  { id: "18", name: "Oundle School", city: "Peterborough", country: "United Kingdom", domain: "oundle.co.uk" },
  { id: "19", name: "Stowe School", city: "Buckingham", country: "United Kingdom", domain: "stowe.co.uk" },
  { id: "20", name: "Haileybury College", city: "Hertford", country: "United Kingdom", domain: "haileybury.com" },
  { id: "21", name: "Gordonstoun School", city: "Elgin", country: "United Kingdom", domain: "gordonstoun.org.uk" },
  { id: "22", name: "Fettes College", city: "Edinburgh", country: "United Kingdom", domain: "fettes.com" },
  { id: "23", name: "Loretto School", city: "Musselburgh", country: "United Kingdom", domain: "loretto.com" },
  { id: "24", name: "Clifton College", city: "Bristol", country: "United Kingdom", domain: "cliftoncollege.com" },
  { id: "25", name: "Millfield School", city: "Street", country: "United Kingdom", domain: "millfieldschool.com" },
  { id: "26", name: "The King's School Canterbury", city: "Canterbury", country: "United Kingdom", domain: "kings-school.co.uk" },
  { id: "27", name: "Sevenoaks School", city: "Sevenoaks", country: "United Kingdom", domain: "sevenoaksschool.org" },
  { id: "28", name: "Bryanston School", city: "Blandford Forum", country: "United Kingdom", domain: "bryanston.co.uk" },
  { id: "29", name: "Malvern College", city: "Malvern", country: "United Kingdom", domain: "malverncollege.org.uk" },
  { id: "30", name: "Wellington College", city: "Crowthorne", country: "United Kingdom", domain: "wellingtoncollege.org.uk" },
  { id: "31", name: "Lancing College", city: "Lancing", country: "United Kingdom", domain: "lancingcollege.co.uk" },
  { id: "32", name: "Ampleforth College", city: "York", country: "United Kingdom", domain: "ampleforth.org.uk" },
  { id: "33", name: "Sherborne School", city: "Sherborne", country: "United Kingdom", domain: "sherborne.org" },
  { id: "34", name: "Glenalmond College", city: "Perth", country: "United Kingdom", domain: "glenalmondcollege.co.uk" },
  { id: "35", name: "Roedean School", city: "Brighton", country: "United Kingdom", domain: "roedean.co.uk" },
  { id: "36", name: "Wycombe Abbey", city: "High Wycombe", country: "United Kingdom", domain: "wycombeabbey.com" },
  { id: "37", name: "Benenden School", city: "Cranbrook", country: "United Kingdom", domain: "benenden.kent.sch.uk" },
  { id: "38", name: "Downe House School", city: "Thatcham", country: "United Kingdom", domain: "downehouse.net" },
  { id: "39", name: "Godolphin and Latymer School", city: "Hammersmith", country: "United Kingdom", domain: "godolphinandlatymer.com" },
  { id: "40", name: "North London Collegiate School", city: "Edgware", country: "United Kingdom", domain: "nlcs.org.uk" },
];

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim().toLowerCase();
  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const results = SCHOOLS.filter((s) => s.name.toLowerCase().includes(query)).slice(0, 8);
  return NextResponse.json({ results });
}
