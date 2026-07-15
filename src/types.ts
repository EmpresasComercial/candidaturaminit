export interface Agendamento {
  id: string;
  nomeCompleto: string;
  telefone?: string;
  email?: string;
  provinciaNaturalidade: string;
  provinciaCandidatura: string;
  orgao: string;
  idade: number;
  genero: string;
  altura: number;
  modalidadePagamento: 'multicaixa' | 'presencial';
  comentario?: string;
  valor: number;
  dataCriacao: string;
  referenciaMulticaixa: string;
  entidadeMulticaixa: string;
  pago: boolean;
  numeroOrdem: number;
  numeroFatura?: string;
}


export const PROVINCIAS_ANGOLA = [
  'Bengo',
  'Benguela',
  'Bié',
  'Cuando',
  'Cubango',
  'Cuanza Norte',
  'Cuanza Sul',
  'Cunene',
  'Huambo',
  'Huíla',
  'Lunda Norte',
  'Lunda Sul',
  'Malanje',
  'Moxico',
  'Namibe',
  'Uíge',
  'Zaire'
];

export const MUNICIPIOS_POPULARES: Record<string, string[]> = {
  'Luanda': ['Luanda', 'Belas', 'Cacuaco', 'Cazenga', 'Icolo e Bengo', 'Quiçama', 'Kilamba Kiaxi', 'Talatona', 'Viana'],
  'Benguela': ['Benguela', 'Baía Farta', 'Catumbela', 'Lobito', 'Balombo', 'Bocoio', 'Caimbambo', 'Chongoroi', 'Ganda', 'Cubal'],
  'Huambo': ['Huambo', 'Caála', 'Eculica', 'Londuimbali', 'Longonjo', 'Mungo', 'Chicala-Choloanga', 'Chinjenje', 'Ucuma', 'Bailundo'],
  'Huila': ['Lubango', 'Caconda', 'Caluquembe', 'Chibia', 'Chicomba', 'Chipindo', 'Cuvango', 'Humpata', 'Jamba', 'Matala', 'Quilengues', 'Quipungo'],
  'Cabinda': ['Cabinda', 'Cacongo', 'Buco-Zau', 'Belize'],
  'Malanje': ['Malanje', 'Cacuso', 'Calandula', 'Cambundi-Catembo', 'Cangandala', 'Kunda-dia-Baze', 'Luquembo', 'Mucari', 'Quela'],
  'Uige': ['Uíge', 'Negage', 'Sanza Pombo', 'Maquela do Zombo', 'Damba', 'Bembe', 'Mucaba', 'Songo'],
};
