const list = `
123456 password 123456789 12345678 12345 1234567 qwerty abc123 password1 111111 123123 1234567890 1234 000000
iloveyou 1q2w3e4r qwertyuiop 123321 654321 666666 121212 7777777 888888 987654321 112233 159753 147258369
qwerty123 1qaz2wsx zaq12wsx asdfghjkl asdf1234 asdfgh qwe123 1q2w3e 1q2w3e4r5t a1b2c3 aaaaaa abcdef abcd1234
monkey dragon letmein football baseball master shadow superman batman trustno1 sunshine princess welcome
login admin admin123 administrator root toor passw0rd p@ssw0rd p@ssword pass pass123 test test123 guest
changeme default secret secret123 hello hello123 hello world helloworld freedom whatever starwars pokemon
charlie michael jennifer jordan hunter buster soccer harley ranger thomas tigger robert daniel andrew
joshua george jessica ashley amanda nicole michelle summer winter spring autumn flower cookie cheese
chocolate butterfly computer internet google facebook youtube twitter instagram minecraft fortnite roblox
liverpool chelsea arsenal barcelona realmadrid juventus manchester killer hacker ninja matrix zombie
pepper ginger maggie lucky bailey sophie charlie1 love lovely loveme lover iloveu ilovegod jesus god angel
angels blessed family forever friends friend money banana orange apple mango cherry purple yellow silver
golden diamond crystal rainbow unicorn tiger lion eagle falcon wolf phoenix dolphin panda kitty kitten
puppy doggy snoopy mickey minnie donald pikachu naruto goku vegeta sasuke itachi luffy zoro anime otaku
qazwsx zxcvbn zxcvbnm asdzxc 1qazxsw2 mustang corvette ferrari porsche mercedes yamaha harley1 jordan23
michael1 password12 password123 passw0rd1 welcome1 welcome123 letmein1 monkey1 dragon1 abc12345 qwerty1
q1w2e3r4 qwer1234 1234qwer 12341234 11111111 00000000 99999999 88888888 12121212 123qwe 123abc 456789
19841984 19851985 19861986 19871987 19881988 19891989 19901990 19911991 19921992 2000 2020 2021 2022
2023 2024 2025 2026 flag ctf capture admin1 root123 toor123 oracle mysql postgres database server linux
ubuntu windows apple123 samsung nokia iphone android galaxy pixel xiaomi huawei
senha senha123 senha1234 123mudar mudar123 mudar trocar brasil brasil123 flamengo corinthians palmeiras
saopaulo santos vasco gremio internacional cruzeiro atletico botafogo fluminense bahia vitoria sport
amor amorzinho meuamor teamo te amo eu teamo123 felicidade saudade familia jesus123 deus deusefiel
gatinha gatinho princesa beleza bebezinho docinho chocolate1 macaco cachorro coracao estrela anjo
abacate abacaxi morango laranja limao melancia pipoca biscoito brigadeiro feijao arroz pastel
futebol carnaval samba rio riodejaneiro bahia123 minas gerais pernambuco recife salvador fortaleza
manaus belem curitiba portoalegre goiania brasilia campinas joao maria jose ana pedro paulo lucas
gabriel rafael bruno felipe gustavo matheus guilherme leonardo rodrigo marcelo fernando ricardo
juliana fernanda amanda1 camila bruna leticia larissa beatriz mariana gabriela isabela carolina
qwerty12 asdasd asdasd123 qweqwe zxczxc 147258 159357 753951 852456 963852741 789456123 741852963
password! Password Password1 Password123 Passw0rd Admin Admin123 Welcome1 Qwerty123 Senha123
letmein! admin@123 root@123 test@123 abc@123 pass@123 user user123 demo demo123 sample temp temp123
`;

export const common = [...new Set(list.trim().split(/\s+/))];
