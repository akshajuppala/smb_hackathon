export const NAICS_722_LEAF_CODES = [
  {
    code: '722310',
    name: 'Food Service Contractors',
    officialScope:
      "Food service provided at other organizations' institutional, government, commercial, or industrial locations under contract for a set period.",
  },
  {
    code: '722320',
    name: 'Caterers',
    officialScope:
      'Single-event food service, typically transporting food to events or preparing it off-premise; includes banquet halls with catering staff.',
  },
  {
    code: '722330',
    name: 'Mobile Food Services',
    officialScope:
      'Meals and snacks prepared and served for immediate consumption from motorized vehicles or nonmotorized carts.',
  },
  {
    code: '722410',
    name: 'Drinking Places (Alcoholic Beverages)',
    officialScope:
      'Bars, taverns, nightclubs, and similar places primarily serving alcoholic beverages for immediate consumption, sometimes with limited food service.',
  },
  {
    code: '722511',
    name: 'Full-Service Restaurants',
    officialScope:
      'Food service where patrons are seated, served by staff, and pay after eating; may also include alcohol, carryout, or live non-theatrical entertainment.',
  },
  {
    code: '722513',
    name: 'Limited-Service Restaurants',
    officialScope:
      'Food service where patrons generally order or select items and pay before eating; food may be eaten on-premise, taken out, or delivered.',
  },
  {
    code: '722514',
    name: 'Cafeterias, Grill Buffets, and Buffets',
    officialScope:
      'Meals prepared and served for immediate consumption using cafeteria-style or buffet equipment, with patrons selecting items from a line or stations.',
  },
  {
    code: '722515',
    name: 'Snack and Nonalcoholic Beverage Bars',
    officialScope:
      'Specialty snack or nonalcoholic beverage places, such as coffee, juice, ice cream, cookie, or popcorn-focused establishments.',
  },
]

export const NAICS_722_LEAF_CODE_MAP = Object.fromEntries(
  NAICS_722_LEAF_CODES.map((entry) => [entry.code, entry])
)
