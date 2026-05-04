export const getIconByInsumoName = (name: string): string => {
  const n = name.toLowerCase();

  // PADARIA E MASSAS
  if (/(pão|brioche|australiano|francês|massa|pizza|pastel|farinha|trigo)/.test(n)) return 'fa-solid fa-plate-wheat';
  
  // LATICÍNIOS 
  if (/(queijo|mussarela|cheddar|prato|requeijão|leite|creme)/.test(n)) return 'fa-solid fa-cheese';
  
  // CARNES
  if (/(carne|bovina|picanha|costela|hambúrguer|burger|picanha|maminha)/.test(n)) return 'kebab_dining';
  if (/(bacon|calabresa|pepperoni|salsicha|presunto)/.test(n)) return 'fa-solid fa-bacon';
  if (/(calabresa|pepperoni|salsicha)/.test(n)) return 'fa-solid fa-bacon';

  // AVES E OVOS
  if (/(frango|chicken|sobrecoxa)/.test(n)) return 'fa-solid fa-drumstick-bite';
  if (/(ovo)/.test(n)) return 'fa-solid fa-egg';

  // PEIXES (Sushi)
  if (/(peixe|salmão|atum|camarão|sushi|nori)/.test(n)) return 'fa-solid fa-fish';

  // VEGETAIS E GRÃOS
  if (/(alface|tomate|cebola|picles|rúcula|pimenta|milho|ervilha|batata)/.test(n)) return 'fa-solid fa-carrot';
  if (/(arroz|feijão|grão)/.test(n)) return 'fa-solid fa-bowl-rice';

  // FRUTAS, AÇAÍ E SORVETERIA
  if (/(morango|banana|kiwi|manga|uva|abacaxi|limão)/.test(n)) return 'fa-solid fa-apple-whole';
  if (/(sorvete|picolé|gelato|açaí)/.test(n)) return 'fa-solid fa-ice-cream';
  if (/(chocolate|cacau|doce|mel|açúcar|granulado)/.test(n)) return 'fa-solid fa-candy-cane';

  // BEBIDAS
  if (/(suco|coca|guaraná|água|refrigerante|tônica|soda|chá)/.test(n)) return 'fa-solid fa-bottle-water';
  if (/(cerveja|chopp|vinho|vodka|álcool)/.test(n)) return 'fa-solid fa-beer-mug-empty';
  if (/(café|espresso|cappuccino)/.test(n)) return 'fa-solid fa-coffee';

  // TEMPEROS E MOLHOS
  if (/(azeite|vinagre|maionese|ketchup|mostarda|óleo|shoyu)/.test(n)) return 'fa-solid fa-jar';

  // PADRÃO
  return 'fa-solid fa-box';
};