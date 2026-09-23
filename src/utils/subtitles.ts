export interface SubtitleResponse {
  text: string;
}

// Full fidelity actual dialogue subtitles for our media items
const subtitlesData: Record<string, Array<{ start: number; end: number; translations: Record<string, string> }>> = {
  dune_2: [
    {
      start: 0,
      end: 4,
      translations: {
        English: "[Low-frequency ominous synthesizer building]",
        Spanish: "[Sintetizador ominoso de baja frecuencia sonora]",
        French: "[Sintetiseur sombre de basse frequence sonore]",
        Hindi: "[धीमा डरावना सिंथेसाइज़र संगीत बज रहा है]"
      }
    },
    {
      start: 4,
      end: 8,
      translations: {
        English: "Paul Atreides: 'The prophecy is a story they wrote list-by-list to control us.'",
        Spanish: "Paul Atreides: 'La profecía es una historia que escribieron para controlarnos.'",
        French: "Paul Atreides : 'La prophetie est une histoire ecrite pour nous controler.'",
        Hindi: "पॉल एट्रिक्स: 'वह भविष्यवाणी हमारे ऊपर राज करने के लिए लिखी गई थी।'"
      }
    },
    {
      start: 8,
      end: 12,
      translations: {
        English: "Chani: 'I don't care about prophecies. I believe in your strength, Paul.'",
        Spanish: "Chani: 'No me importan las profecías. Creo en tu fuerza, Paul.'",
        French: "Chani : 'Je m'en fiche des propheties. Je crois en ta force, Paul.'",
        Hindi: "चानी: 'मुझे भविष्यवाणियों की परवाह नहीं है। मुझे तुम्हारी ताकत पर विश्वास है पॉल।'"
      }
    },
    {
      start: 12,
      end: 16,
      translations: {
        English: "[Rhythmic thudding of a Fremen sand-thump echoed in distant canyons]",
        Spanish: "[El golpeteo rítmico de un martillo de arena Fremen resuena]",
        French: "[Le battement rythmique d'un marteau de sable Fremen resonne]",
        Hindi: "[रेत पर चलने वाले फ़्रेमेन थांपर की गूँजती आवाज़]"
      }
    },
    {
      start: 16,
      end: 22,
      translations: {
        English: "Paul Atreides: 'We must ride the grandfather sandworm... to the southern siege!'",
        Spanish: "Paul Atreides: '¡Debemos montar el gusano de arena ancestral... al asedio del sur!'",
        French: "Paul Atreides : 'Nous devons chevaucher le ver des sables ancestral !'",
        Hindi: "पॉल एट्रिक्स: 'हमें सबसे बड़े सैंडवर्म की सवारी करके दक्षिणी सीमा तक जाना होगा!'"
      }
    },
    {
      start: 22,
      end: 27,
      translations: {
        English: "Stilgar: 'Shai-Hulud has chosen you, Usul! Ride! Lead us to victory!'",
        Spanish: "Stilgar: '¡Shai-Hulud te ha elegido, Usul! ¡Dirígenos a la victoria!'",
        French: "Stilgar : 'Shai-Hulud t'a choisi, Usul ! Guide-nous vers la victoire !'",
        Hindi: "स्टिलगर: 'शाई-हुलुद ने तुम्हें चुना है, उसुल! हमारी जीत का नेतृत्व करो!'"
      }
    },
    {
      start: 27,
      end: 32,
      translations: {
        English: "[SANDSTORM ROARING: Massive desert winds swirl with glittering spice dust]",
        Spanish: "[TORMENTA DE ARENA: Vientos rugen con polvo de especia brillante]",
        French: "[TEMPETE DE SABLE : Vents violents avec de la poussiere d'epice]",
        Hindi: "[धूल भरी आंधी: रेगिस्तानी हवाओं में चमकते मसाले उड़ रहे हैं]"
      }
    },
    {
      start: 32,
      end: 38,
      translations: {
        English: "Chani: 'The desert is our home. The Harkonnens will drown in our sands.'",
        Spanish: "Chani: 'El desierto es nuestro hogar. Los Harkonnen se ahogarán aquí.'",
        French: "Chani : 'Le desert est notre maison. Les Harkonnens s'y noieront.'",
        Hindi: "चानी: 'यह रेगिस्तान हमारा घर है। हारकोनेन्स को इस रेत में दफन होना होगा।'"
      }
    },
    {
      start: 38,
      end: 45,
      translations: {
        English: "[Epic orchestral brass choir crescendo playing]",
        Spanish: "[Crescendo de orquesta épica de metales tocando]",
        French: "[Musique orchestrale de cuivres en plein crescendo]",
        Hindi: "[शानदार ऑर्केस्ट्रा संगीत अपने चरम पर पहुँच रहा है]"
      }
    }
  ],
  stranger_things: [
    {
      start: 0,
      end: 4,
      translations: {
        English: "[An ominous 80s analog synth melody pulsing with retro tape delay]",
        Spanish: "[Pulsos de sintetizador analógico de los 80 con retraso de cinta]",
        French: "[Sinthetiseur analogique des annees 80 au rythme sombre]",
        Hindi: "[80 के दशक का रहस्यमयी सिंथेसाइज़र संगीत चालू है]"
      }
    },
    {
      start: 4,
      end: 8,
      translations: {
        English: "Dustin: 'Guys, did you hear that? The compass needle is fluctuating!'",
        Spanish: "Dustin: 'Oigan, ¿escucharon eso? ¡La aguja de la brújula está girando!'",
        French: "Dustin : 'Les gars, vous entendez ? L'aiguille de la boussole tourne !'",
        Hindi: "डस्टिन: 'दोस्तों, क्या तुमने सुना? दिशा-सूचक की सुई हिल रही है!'"
      }
    },
    {
      start: 8,
      end: 12,
      translations: {
        English: "Mike: 'It's pulling towards the magnetic disturbance. It's the Gate!'",
        Spanish: "Mike: 'Apunta hacia la perturbación magnética. ¡Es el Portal!'",
        French: "Mike : 'Elle pointe vers la perturbation magnetique. C'est le Portail !'",
        Hindi: "माइक: 'यह चुंबकीय गड़बड़ी की तरफ इशारा कर रही है। ये वही दरवाज़ा है!'"
      }
    },
    {
      start: 12,
      end: 16,
      translations: {
        English: "Eleven: 'The gate... it is open. He is coming...'",
        Spanish: "Eleven: 'El portal... está abierto. Él ya viene...'",
        French: "Eleven : 'Le portail... est ouvert. Il arrive...'",
        Hindi: "इलेवन: 'दरवाज़ा... खुल चुका है। वह आ रहा है...'"
      }
    },
    {
      start: 16,
      end: 22,
      translations: {
        English: "Lucas: 'Get your slingshot ready, because this is definitely not a raccoon!'",
        Spanish: "Lucas: '¡Preparen sus resorteras, porque esto definitivamente no es un mapache!'",
        French: "Lucas : 'Sortez vos lance-pierres, ce n'est pas un raton laveur !'",
        Hindi: "लुकास: 'अपनी गुलेल तानकर रखो, ये कोई सीधा जानवर नहीं है!'"
      }
    },
    {
      start: 22,
      end: 27,
      translations: {
        English: "Eleven: 'No... Mike. I must go to the Upside Down to close it.'",
        Spanish: "Eleven: 'No... Mike. Debo ir al Mundo del Revés para cerrarlo.'",
        French: "Eleven : 'Non... Mike. Je dois aller dans le Monde a l'Envers.'",
        Hindi: "इलेवन: 'नहीं... माइक। इसे बंद करने के लिए मुझे उस पार जाना होगा।'"
      }
    },
    {
      start: 27,
      end: 32,
      translations: {
        English: "[Flickering lights buzzing as high-voltage electricity surges in the basement]",
        Spanish: "[Luces parpadean y parpadean con sobrecarga eléctrica en el sótano]",
        French: "[Les lumieres scintillent dans le sous-sol electrocute]",
        Hindi: "[रोशिनयाँ टिमटिमा रही हैं और बिजली गूँज रही है]"
      }
    },
    {
      start: 32,
      end: 38,
      translations: {
        English: "Dustin: 'Holy cow, the wall is tearing! Move back! Run!'",
        Spanish: "Dustin: '¡Vaya, la pared se está rompiendo! ¡Atrás! ¡Corran!'",
        French: "Dustin : 'Oh mon Dieu, le mur se dechire ! Reculez ! Courez !'",
        Hindi: "डस्टिन: 'अरे बाप रे! दीवार फट रही है, पीछे हटो! भागो!'"
      }
    },
    {
      start: 38,
      end: 45,
      translations: {
        English: "[Demogorgon screeches and roars in the dimensional rift]",
        Spanish: "[El Demogorgon chilla y ruge en la brecha dimensional]",
        French: "[Le Demogorgon hurle dans la faille dimensionnelle]",
        Hindi: "[डरावना डेमोगोर्गन चीखता हुआ दरवाज़े से गुज़रता है]"
      }
    }
  ],
  avatar_2: [
    {
      start: 0,
      end: 4,
      translations: {
        English: "[Ethereal forest flute melodies paired with water ripples]",
        Spanish: "[Flautas etéreas del bosque con sutiles olas de agua]",
        French: "[Flutes de la foret harmonisees avec le clapotis de l'eau]",
        Hindi: "[बांसुरी की धीमी धुन के साथ पानी की लहरों की आवाज़]"
      }
    },
    {
      start: 4,
      end: 8,
      translations: {
        English: "Jake: 'Pandora's oceans are filled with a life we are only beginning to understand.'",
        Spanish: "Jake: 'Los océanos de Pandora albergan vida que apenas empezamos a comprender.'",
        French: "Jake : 'Les oceans de Pandora abritent une vie complexe.'",
        Hindi: "जेक: 'पेंडोरा के समंदर अनसुनी दुनियाओं के रहस्यों से भरे हैं।'"
      }
    },
    {
      start: 8,
      end: 12,
      translations: {
        English: "Neytiri: 'The Great Madre Eywa connects all of us—land, sky, and water.'",
        Spanish: "Neytiri: 'La Gran Madre Eywa nos conecta a todos—tierra, cielo y agua.'",
        French: "Neytiri : 'La Grande Mere Eywa nous connecte tous : terre, ciel et eau.'",
        Hindi: "नेटिरी: 'महान माता एयवा हम सबको जोड़ती है - धरती, आकाश और जल को।'"
      }
    },
    {
      start: 12,
      end: 16,
      translations: {
        English: "Tonowari: 'You may stay with our tribe, but you do not know the reef.'",
        Spanish: "Tonowari: 'Pueden quedarse con la tribu, pero no conocen el arrecife.'",
        French: "Tonowari : 'Vous pouvez rester, mais vous ne connaissez pas le recif.'",
        Hindi: "टोनोवारी: 'तुम यहाँ रह सकते हो, पर तुम अभी समंदर के तरीके नहीं जानते।'"
      }
    },
    {
      start: 16,
      end: 22,
      translations: {
        English: "Jake: 'I can learn. We will adapt. We want to protect Pandora together.'",
        Spanish: "Jake: 'Aprenderé. Nos adaptaremos. Queremos proteger Pandora juntos.'",
        French: "Jake : 'Je peux apprendre. Nous voulons proteger notre foyer.'",
        Hindi: "जेक: 'मैं सीखूँगा। हम सामंजस्य बिठाएंगे। हम साथ मिलकर रक्षा करेंगे।'"
      }
    },
    {
      start: 22,
      end: 27,
      translations: {
        English: "Neytiri: 'They bring their war machines here! The sky people do not stop!'",
        Spanish: "Neytiri: '¡Traen sus máquinas de guerra! ¡La gente del cielo no se detiene!'",
        French: "Neytiri : 'Ils apportent leurs machines de guerre ! Ils ne s'arreteront pas !'",
        Hindi: "नेटिरी: 'वे अपने युद्ध के हथियार यहाँ ला रहे हैं! वे आसमान के लोग रुकेंगे नहीं!'"
      }
    },
    {
      start: 27,
      end: 32,
      translations: {
        English: "[SPLASHING: Massive marine beast breaches water surface majestically]",
        Spanish: "[CHAPOTEO: Una criatura acuática gigante emerge majestuosamente]",
        French: "[ECLABOUSSURE : Une immense creature marine jaillit de l'eau]",
        Hindi: "[विशाल समुद्री जीव पानी से ऊपर छलांग लगाता है]"
      }
    },
    {
      start: 32,
      end: 38,
      translations: {
        English: "Lo'ak: 'Payakan is my friend. He is not a killer, no matter what they say!'",
        Spanish: "Lo'ak: 'Payakan es mi amigo. No es un asesino, ¡no importa lo que digan!'",
        French: "Lo'ak : 'Payakan est mon ami. Ce n'est pas un tueur !'",
        Hindi: "लोआक: 'पायाकान मेरा दोस्त है। वह कोई शिकारी नहीं है चाहे लोग कुछ भी कहें।'"
      }
    },
    {
      start: 38,
      end: 45,
      translations: {
        English: "[Tribal war chants and coral-reef ambient waves crashing]",
        Spanish: "[Cantos tribales de guerra y olas rompiendo en el arrecife]",
        French: "[Chants de guerre tribaux et fracas des vagues du recif]",
        Hindi: "[युद्ध के जयकारे और लहरों का किनारों से टकराना]"
      }
    }
  ],
  spiderman_verse: [
    {
      start: 0,
      end: 4,
      translations: {
        English: "[Upbeat energetic hip-hop beat paired with scratching turntables]",
        Spanish: "[Ritmo de hip-hop energético con sonidos de tornamesa]",
        French: "[Musique hip-hop rythmee avec sons de platine vinyle]",
        Hindi: "[तेज़ हिप-हॉप संगीत और डीजे स्क्रैच की आवाज़]"
      }
    },
    {
      start: 4,
      end: 8,
      translations: {
        English: "Miles: 'My name is Miles Morales. I'm the one and only Spider-Man... at least I thought so.'",
        Spanish: "Miles: 'Me llamo Miles Morales. Soy el único Hombre Araña... o eso pensaba.'",
        French: "Miles : 'Je m'appelle Miles Morales. Je suis l'unique Spider-Man... enfin je croyais.'",
        Hindi: "माइल्स: 'मेरा नाम माइल्स मोरालेस है। मैं अकेला स्पाइडर-मैन हूँ... या मैंने ऐसा ही सोचा था।'"
      }
    },
    {
      start: 8,
      end: 12,
      translations: {
        English: "Gwen: 'Every dimension has its own story, Miles. And they are all connected.'",
        Spanish: "Gwen: 'Cada dimensión tiene su propia historia, Miles. Y todas están conectadas.'",
        French: "Gwen : 'Chaque dimension a sa propre histoire, Miles. Et elles sont toutes liees.'",
        Hindi: "ग्वेन: 'हर ब्रह्मांड की अपनी कहानी होती है, माइल्स। और वे सब आपस में जुड़े हैं।'"
      }
    },
    {
      start: 12,
      end: 16,
      translations: {
        English: "Miguel O'Hara: 'Your existence is a threat to the canon, Morales! You shouldn't exist!'",
        Spanish: "Miguel O'Hara: '¡Tu existencia es una amenaza para el canon, Morales! ¡No deberías estar aquí!'",
        French: "Miguel O'Hara : 'Ton existence menace le canon, Morales ! Tu ne devrais pas etre la !'",
        Hindi: "मिगुएल ओ'हारा: 'तुम्हारा होना इस नियम के खिलाफ है, मोरालेस! तुम स्पाइडर-मैन नहीं हो!'"
      }
    },
    {
      start: 16,
      end: 22,
      translations: {
        English: "Miles: 'Everyone keeps telling me how my story is supposed to go. Nah, I do my own thing!'",
        Spanish: "Miles: 'Todos me dicen cómo debe ir mi historia. ¡No, yo haré las cosas a mi manera!'",
        French: "Miles : 'On me dit toujours comment mon histoire doit finir. Non, j'ecris ma propre voie !'",
        Hindi: "माइल्स: 'सब मुझे बताते हैं कि कहानी कैसे बदलनी चाहिए। पर मैं अपना काम खुद करता हूँ!'"
      }
    },
    {
      start: 22,
      end: 27,
      translations: {
        English: "Gwen: 'I didn't want you to find out like this. It's the only way to save the multiverse.'",
        Spanish: "Gwen: 'No quería que te enteraras así. Es la única forma de salvar el multiverso.'",
        French: "Gwen : 'Je ne voulais pas que tu l'apprennes ainsi. C'est l'unique moyen de sauver le monde.'",
        Hindi: "ग्वेन: 'मैं तुम्हें ऐसे बताना नहीं चाहती थी। ब्रह्मांड को बचाने का यही एक रास्ता है।'"
      }
    },
    {
      start: 27,
      end: 32,
      translations: {
        English: "[WHOOSHING: Portal opens, casting gorgeous neon color spectrums across the room]",
        Spanish: "[ZUMBIDO: El portal se abre liberando espectros de luz de neón]",
        French: "[BRUIT SOURD : Un portail s'ouvre, projetant des couleurs de neon]",
        Hindi: "[पोर्टल खुलता है और हवा में नियॉन रंगों की रोशनी बिखरती है]"
      }
    },
    {
      start: 32,
      end: 38,
      translations: {
        English: "Miles: 'I can save my dad AND save the world! Watch me!'",
        Spanish: "Miles: '¡Puedo salvar a mi padre Y salvar al mundo! ¡Observen!'",
        French: "Miles : 'Je peux sauver mon pere ET sauver le monde ! Regardez-moi !'",
        Hindi: "माइल्स: 'मैं अपने पिता और दुनिया दोनों को बचा सकता हूँ! देखते जाओ!'"
      }
    },
    {
      start: 38,
      end: 45,
      translations: {
        English: "[THWIP! Web shooters engaging in rapid succession]",
        Spanish: "[¡THWIP! Los lanzarredes se disparan rápidamente]",
        French: "[THWIP ! Dispositifs de lance-toile lances en rafale]",
        Hindi: "[मकड़ी का जाला तेज़ी से फेंकने की आवाज़ आ रही है]"
      }
    }
  ],
  interstellar: [
    {
      start: 0,
      end: 4,
      translations: {
        English: "[Majestic pipe organ music rising, evoking the vast loneliness of space]",
        Spanish: "[Música majestuosa de órgano elevándose que evoca la soledad del espacio]",
        French: "[Musique d'orgue majestueuse rappelant l'immensite spatiale]",
        Hindi: "[पाइप ऑर्गन का संगीत ब्रह्मांड की विशालता को दर्शाता है]"
      }
    },
    {
      start: 4,
      end: 8,
      translations: {
        English: "Cooper: 'We're of the Earth, Murph. But we were never meant to die here.'",
        Spanish: "Cooper: 'Somos de la Tierra, Murph. Pero nunca estuvimos destinados a morir aquí.'",
        French: "Cooper : 'Nous venons de la Terre, Murph. Mais nous ne devions pas y crever.'",
        Hindi: "कूपर: 'हमारा जन्म इसी धरती पर हुआ था मर्फ। पर हमें यहाँ समाप्त नहीं होना है।'"
      }
    },
    {
      start: 8,
      end: 12,
      translations: {
        English: "Brand: 'Love is the one thing we perceive that transcends dimensions of space and time.'",
        Spanish: "Brand: 'El amor es lo único que percibimos que trasciende las dimensiones del espacio y del tiempo.'",
        French: "Brand : 'L'amour transcende toutes les dimensions de l'espace et du temps.'",
        Hindi: "ब्रैंड: 'प्यार ही अकेली चीज़ है जहाँ दूरी और समय का बंधन समाप्त हो जाता है।'"
      }
    },
    {
      start: 12,
      end: 16,
      translations: {
        English: "TARS: 'My humor setting is currently at seventy-five percent, Cooper.'",
        Spanish: "TARS: 'Mi nivel de humor está configurado al setenta y cinco por ciento, Cooper.'",
        French: "TARS : 'Mon parametrage d'humour est desormais a 75%, Cooper.'",
        Hindi: "टार्स: 'मेरी मज़ाक करने की सीमा अभी पचहत्तर प्रतिशत है कूपर।'"
      }
    },
    {
      start: 16,
      end: 22,
      translations: {
        English: "Cooper: 'We've got to find a way back... for our kids. For humanity.'",
        Spanish: "Cooper: 'Tenemos que encontrar un camino de regreso... por nuestros hijos. Por la humanidad.'",
        French: "Cooper : 'Nous devons trouver un moyen de rentrer... pour nos gosses.'",
        Hindi: "कूपर: 'हमें वापस जाने का रास्ता ढूंढना होगा... अपने बच्चों और मानवता के लिए।'"
      }
    },
    {
      start: 22,
      end: 27,
      translations: {
        English: "Murph: 'Don't let him leave, Grandpa! The dust is spelling out: S-T-A-Y!'",
        Spanish: "Murph: '¡No dejes que se vaya, abuelo! ¡El polvo deletrea: S-T-A-Y!'",
        French: "Murph : 'Ne le laisse pas partir ! La poussiere ecrit : RESTE !'",
        Hindi: "मर्फ: 'उन्हें जाने मत दो दादाजी! धूल के कण कह रहे हैं: रुक जाओ!'"
      }
    },
    {
      start: 27,
      end: 32,
      translations: {
        English: "[METALLIC THUNKING: Endurance ship enters the colossal gravitational field of Gargantua]",
        Spanish: "[GOLPES METÁLICOS: La nave Endurance entra al campo de gravedad de Gargantúa]",
        French: "[Endurance entre dans le puissant champ gravitationnel de Gargantua]",
        Hindi: "[गूँज: अंतरिक्ष यान ब्लैक होल गार्गेंटुआ के ताकतवर गुरुत्वाकर्षण में जाता है]"
      }
    },
    {
      start: 32,
      end: 38,
      translations: {
        English: "TARS: 'The event horizon is crossing. Gravity readings are off the charts.'",
        Spanish: "TARS: 'Cruzando el horizonte de sucesos. Las lecturas de gravedad son extremas.'",
        French: "TARS : 'Franchissement de l'horizon des evenements. Gravite maximale.'",
        Hindi: "टार्स: 'हम इवेंट होराइज़न पार कर रहे हैं। गुरुत्वाकर्षण सीमा से बाहर है।'"
      }
    },
    {
      start: 38,
      end: 45,
      translations: {
        English: "[Pipe organ crescendo reaching max volume, vibrating with cosmic resonance]",
        Spanish: "[Crescendo de órgano de tubos vibrando con resonancia cósmica]",
        French: "[L'orgue resonne a pleine puissance dans le vide spatial]",
        Hindi: "[ऑर्गन का संगीत अपने पूरे स्वर में गूँज रहा है]"
      }
    }
  ],
  wednesday: [
    {
      start: 0,
      end: 4,
      translations: {
        English: "[Plucked dark harpsichord instrumentation playing with a mischievous tone]",
        Spanish: "[Clavecín oscuro y travieso tocando de fondo]",
        French: "[Clavecin sombre et espiegle jouant en fond]",
        Hindi: "[रहस्यमयी और शरारती धुन बज रही है]"
      }
    },
    {
      start: 4,
      end: 8,
      translations: {
        English: "Wednesday: 'I find social media to be a soul-sucking void of meaningless validation.'",
        Spanish: "Wednesday: 'Las redes sociales me parecen un vacío succionador de almas.'",
        French: "Wednesday : 'Les reseaux sociaux aspirent l'ame dans un vide d'approbations.'",
        Hindi: "वेडनसडे: 'मुझे सोशल मीडिया केवल आत्मा निचोड़ने वाली व्यर्थ जगह लगती है।'"
      }
    },
    {
      start: 8,
      end: 12,
      translations: {
        English: "Enid: 'Come on, roomie! A little color won't kill you. This is Nevermore Academy!'",
        Spanish: "Enid: '¡Vamos, rumie! Un poco de color no te matará. ¡Es la Academia Nunca Más!'",
        French: "Enid : 'Allez, coloc ! Un peu de couleur ne te tuera pas !'",
        Hindi: "एनिड: 'चलो भी रूम पार्टनर! थोड़ा रंग बिरंगा होने से कोई मर नहीं जाता।'"
      }
    },
    {
      start: 12,
      end: 16,
      translations: {
        English: "Wednesday: 'Actually, extreme color gives me hives. It makes my skin crawl.'",
        Spanish: "Wednesday: 'De hecho, el color extremo me produce urticaria. Me repele.'",
        French: "Wednesday : 'En verite, l'exces de couleur me donne de l'urticaire. Ça me degoute.'",
        Hindi: "वेडनसडे: 'असल में, अधिक रंग देखकर मुझे खुजली होने लगती है।'"
      }
    },
    {
      start: 16,
      end: 22,
      translations: {
        English: "Uncle Fester: 'Your parents were trouble back in the day, Wednesday. Watch your back.'",
        Spanish: "Tío Fester: 'Tus padres daban problemas en su época, Wednesday. Ten cuidado.'",
        French: "Oncle Fester : 'Tes parents etaient des perturbateurs a l'epoque. Fais attention.'",
        Hindi: "अंकल फेस्टर: 'तुम्हारे माता-पिता अपने समय में बड़े शरारती थे। संभल कर रहना।'"
      }
    },
    {
      start: 22,
      end: 27,
      translations: {
        English: "Wednesday: 'If anyone is going to murder me, I expect them to do it with some style.'",
        Spanish: "Wednesday: 'Si alguien va a intentar asesinarme, espero que lo haga con estilo.'",
        French: "Wednesday : 'Si quelqu'un doit m'assassiner, je m'attends a ce qu'il ait du style.'",
        Hindi: "वेडनसडे: 'अगर कोई मेरी जान लेना चाहेगा, तो मैं चाहूंगी वो सलीके से ऐसा करे।'"
      }
    },
    {
      start: 27,
      end: 32,
      translations: {
        English: "[CREAKING: Secret door opens in Nevermore's grand library under the gargoyles]",
        Spanish: "[CRUJIDO: Puerta secreta se abre en la gran biblioteca]",
        French: "[GRINCEMENT : Porte secrete s'ouvrant dans la bibliotheque]",
        Hindi: "[दरवाज़ा खुलने की आवाज़: पुस्तकालय में एक गुप्त दरवाज़ा खुलता है]"
      }
    },
    {
      start: 32,
      end: 38,
      translations: {
        English: "Enid: 'Did Thing just do a manicured thumbs-up? That is so cute!'",
        Spanish: "Enid: '¿Cosa acaba de hacer un pulgar arriba recién pintado? ¡Qué tierno!'",
        French: "Enid : 'La Chose vient de faire un pouce levre vernis ? C'est trop mignon !'",
        Hindi: "एनिड: 'क्या थिंग ने हमें अंगूठा दिखाया? यह सचमुच कितना प्यारा है!'"
      }
    },
    {
      start: 38,
      end: 45,
      translations: {
        English: "[SNAP SNAP: Wednesday performs the iconic double hand-finger snap]",
        Spanish: "[¡CHASQUIDO CHASQUIDO!: Sonido icónico de doble chasquida de dedos]",
        French: "[CLAQUEMENT CLAQUEMENT : Le double claquement de doigts iconique]",
        Hindi: "[दोगुनी ताली: उँगलियों के चुटकी बजाने की प्रसिद्ध आवाज़]"
      }
    }
  ]
};

export function getSubtitleText(mediaId: string, language: string, time: number): string {
  if (language === 'Off' || !mediaId) return '';

  // Handle formatted season episode IDs (e.g., dune_2_s1_e1 -> parent is dune_2)
  const baseId = mediaId.includes('_s') ? mediaId.split('_')[0] : mediaId;

  const itemSubtitles = subtitlesData[baseId];
  if (!itemSubtitles) {
    // Elegant absolute fallback if item itself has no custom script
    const t = Math.floor(time);
    if (t >= 1 && t < 5) return `[Streaming Dolby Digital sound effects]`;
    if (t >= 5 && t < 10) return `[Exclusive Streaming on StarFlix Premium Series]`;
    if (t >= 10 && t < 15) return `[Speaking foreign language dynamically]`;
    return '';
  }

  const match = itemSubtitles.find(sub => time >= sub.start && time <= sub.end);
  if (match) {
    return match.translations[language] || match.translations['English'] || '';
  }

  return '';
}
