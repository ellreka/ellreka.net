import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import opentype from 'opentype.js'
import mikan from 'mikanjs'

const root = process.cwd()

const WIDTH = 1200
const HEIGHT = 630
const FONT_SIZE = 46
// const MAX_FONT_SIZE = FONT_SIZE * 3

export const generateOgp = async ({
  title,
  slug
}: {
  title: string
  slug: string
}) => {
  const ogpPath = path.join(root, 'public', 'ogp', `${slug}.png`)
  console.log({ ogpPath, exit: fs.existsSync(ogpPath) })
  if (fs.existsSync(ogpPath)) return

  const font = await opentype.load(path.join(root, 'fonts/MPLUS1p-Bold.ttf'))
  const generateTextPath = () => {
    const stringArr = mikan.split(title)
    const charCount = Array.from(title).length
    const line = Math.ceil(charCount / 20)
    const columns: string[] = []
    let tmp = ''
    for (const str of stringArr) {
      tmp += str
      if (tmp.length > charCount / line) {
        columns.push(tmp)
        tmp = ''
      }
    }
    columns.push(tmp)

    const paths = []
    for (let i = 0; i < columns.length; i++) {
      const path = font.getPath(
        columns[i],
        0,
        HEIGHT / 2 - 50 - FONT_SIZE * columns.length + 90 * i,
        FONT_SIZE
      )
      path.fill = 'white'
      paths.push(path)
    }

    return paths.map((path) => path.toSVG(2)).join()
  }
  const svg = Buffer.from(
    `
    <svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <rect width="1200" height="630" fill="#303C4B"/>
      <mask id="mask0_0_1" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="558" y="518" width="82" height="82">
      <circle cx="599" cy="559" r="41" fill="#C4C4C4"/>
      </mask>
      <g transform="translate(70, 70)">
      ${generateTextPath()}
      </g>
      <g mask="url(#mask0_0_1)">
      <rect x="558" y="518" width="82" height="82" fill="url(#pattern0)"/>
      </g>
      <path d="M989.886 572.341C988.091 572.341 986.545 571.977 985.25 571.25C983.962 570.515 982.97 569.477 982.273 568.136C981.576 566.788 981.227 565.193 981.227 563.352C981.227 561.557 981.576 559.981 982.273 558.625C982.97 557.269 983.951 556.212 985.216 555.455C986.489 554.697 987.981 554.318 989.693 554.318C990.845 554.318 991.917 554.504 992.909 554.875C993.909 555.239 994.78 555.788 995.523 556.523C996.273 557.258 996.856 558.182 997.273 559.295C997.689 560.402 997.898 561.697 997.898 563.182V564.511H983.159V561.511H993.341C993.341 560.814 993.189 560.197 992.886 559.659C992.583 559.121 992.163 558.701 991.625 558.398C991.095 558.087 990.477 557.932 989.773 557.932C989.038 557.932 988.386 558.102 987.818 558.443C987.258 558.777 986.818 559.227 986.5 559.795C986.182 560.356 986.019 560.981 986.011 561.67V564.523C986.011 565.386 986.17 566.133 986.489 566.761C986.814 567.39 987.273 567.875 987.864 568.216C988.455 568.557 989.155 568.727 989.966 568.727C990.504 568.727 990.996 568.652 991.443 568.5C991.89 568.348 992.273 568.121 992.591 567.818C992.909 567.515 993.152 567.144 993.318 566.705L997.795 567C997.568 568.076 997.102 569.015 996.398 569.818C995.701 570.614 994.799 571.235 993.693 571.682C992.595 572.121 991.326 572.341 989.886 572.341ZM1005.9 548.727V572H1001.06V548.727H1005.9ZM1014.62 548.727V572H1009.78V548.727H1014.62ZM1018.49 572V554.545H1023.19V557.591H1023.37C1023.69 556.508 1024.22 555.689 1024.97 555.136C1025.72 554.576 1026.59 554.295 1027.56 554.295C1027.8 554.295 1028.07 554.311 1028.35 554.341C1028.63 554.371 1028.87 554.413 1029.09 554.466V558.761C1028.86 558.693 1028.54 558.633 1028.14 558.58C1027.74 558.527 1027.37 558.5 1027.04 558.5C1026.33 558.5 1025.69 558.655 1025.13 558.966C1024.58 559.269 1024.14 559.693 1023.81 560.239C1023.49 560.784 1023.34 561.413 1023.34 562.125V572H1018.49ZM1038.73 572.341C1036.93 572.341 1035.39 571.977 1034.09 571.25C1032.81 570.515 1031.81 569.477 1031.12 568.136C1030.42 566.788 1030.07 565.193 1030.07 563.352C1030.07 561.557 1030.42 559.981 1031.12 558.625C1031.81 557.269 1032.79 556.212 1034.06 555.455C1035.33 554.697 1036.82 554.318 1038.54 554.318C1039.69 554.318 1040.76 554.504 1041.75 554.875C1042.75 555.239 1043.62 555.788 1044.37 556.523C1045.12 557.258 1045.7 558.182 1046.12 559.295C1046.53 560.402 1046.74 561.697 1046.74 563.182V564.511H1032V561.511H1042.18C1042.18 560.814 1042.03 560.197 1041.73 559.659C1041.43 559.121 1041.01 558.701 1040.47 558.398C1039.94 558.087 1039.32 557.932 1038.62 557.932C1037.88 557.932 1037.23 558.102 1036.66 558.443C1036.1 558.777 1035.66 559.227 1035.34 559.795C1035.03 560.356 1034.86 560.981 1034.86 561.67V564.523C1034.86 565.386 1035.01 566.133 1035.33 566.761C1035.66 567.39 1036.12 567.875 1036.71 568.216C1037.3 568.557 1038 568.727 1038.81 568.727C1039.35 568.727 1039.84 568.652 1040.29 568.5C1040.73 568.348 1041.12 568.121 1041.43 567.818C1041.75 567.515 1042 567.144 1042.16 566.705L1046.64 567C1046.41 568.076 1045.95 569.015 1045.24 569.818C1044.54 570.614 1043.64 571.235 1042.54 571.682C1041.44 572.121 1040.17 572.341 1038.73 572.341ZM1054.29 566.977L1054.3 561.17H1055L1060.59 554.545H1066.15L1058.64 563.318H1057.49L1054.29 566.977ZM1049.9 572V548.727H1054.74V572H1049.9ZM1060.81 572L1055.67 564.398L1058.9 560.977L1066.48 572H1060.81ZM1073.5 572.33C1072.39 572.33 1071.4 572.136 1070.53 571.75C1069.65 571.356 1068.96 570.777 1068.46 570.011C1067.96 569.239 1067.71 568.277 1067.71 567.125C1067.71 566.155 1067.89 565.341 1068.24 564.682C1068.6 564.023 1069.08 563.492 1069.7 563.091C1070.31 562.689 1071.01 562.386 1071.79 562.182C1072.57 561.977 1073.4 561.833 1074.26 561.75C1075.28 561.644 1076.1 561.545 1076.72 561.455C1077.34 561.356 1077.79 561.212 1078.07 561.023C1078.35 560.833 1078.49 560.553 1078.49 560.182V560.114C1078.49 559.394 1078.26 558.837 1077.81 558.443C1077.36 558.049 1076.73 557.852 1075.9 557.852C1075.03 557.852 1074.34 558.045 1073.82 558.432C1073.31 558.811 1072.96 559.288 1072.8 559.864L1068.32 559.5C1068.55 558.439 1069 557.523 1069.66 556.75C1070.33 555.97 1071.19 555.371 1072.24 554.955C1073.3 554.53 1074.53 554.318 1075.92 554.318C1076.89 554.318 1077.82 554.432 1078.71 554.659C1079.6 554.886 1080.39 555.239 1081.08 555.716C1081.78 556.193 1082.33 556.807 1082.73 557.557C1083.13 558.299 1083.33 559.189 1083.33 560.227V572H1078.74V569.58H1078.61C1078.32 570.125 1077.95 570.606 1077.48 571.023C1077.01 571.432 1076.45 571.754 1075.79 571.989C1075.13 572.216 1074.37 572.33 1073.5 572.33ZM1074.89 568.989C1075.6 568.989 1076.23 568.848 1076.78 568.568C1077.32 568.28 1077.75 567.894 1078.06 567.409C1078.37 566.924 1078.53 566.375 1078.53 565.761V563.909C1078.37 564.008 1078.17 564.098 1077.9 564.182C1077.64 564.258 1077.35 564.33 1077.03 564.398C1076.7 564.458 1076.37 564.515 1076.05 564.568C1075.72 564.614 1075.43 564.655 1075.16 564.693C1074.59 564.777 1074.1 564.909 1073.67 565.091C1073.25 565.273 1072.92 565.519 1072.68 565.83C1072.45 566.133 1072.33 566.511 1072.33 566.966C1072.33 567.625 1072.57 568.129 1073.05 568.477C1073.53 568.818 1074.15 568.989 1074.89 568.989ZM1089.92 572.295C1089.17 572.295 1088.52 572.03 1087.99 571.5C1087.46 570.962 1087.19 570.318 1087.19 569.568C1087.19 568.826 1087.46 568.189 1087.99 567.659C1088.52 567.129 1089.17 566.864 1089.92 566.864C1090.64 566.864 1091.28 567.129 1091.83 567.659C1092.37 568.189 1092.64 568.826 1092.64 569.568C1092.64 570.068 1092.52 570.527 1092.26 570.943C1092.01 571.352 1091.68 571.682 1091.27 571.932C1090.86 572.174 1090.41 572.295 1089.92 572.295ZM1101.46 561.909V572H1096.62V554.545H1101.23V557.625H1101.44C1101.82 556.61 1102.47 555.807 1103.38 555.216C1104.29 554.617 1105.39 554.318 1106.69 554.318C1107.9 554.318 1108.96 554.583 1109.86 555.114C1110.76 555.644 1111.46 556.402 1111.96 557.386C1112.46 558.364 1112.71 559.53 1112.71 560.886V572H1107.87V561.75C1107.88 560.682 1107.6 559.848 1107.05 559.25C1106.5 558.644 1105.74 558.341 1104.77 558.341C1104.12 558.341 1103.54 558.481 1103.04 558.761C1102.55 559.042 1102.16 559.451 1101.88 559.989C1101.61 560.519 1101.47 561.159 1101.46 561.909ZM1124.48 572.341C1122.68 572.341 1121.14 571.977 1119.84 571.25C1118.56 570.515 1117.56 569.477 1116.87 568.136C1116.17 566.788 1115.82 565.193 1115.82 563.352C1115.82 561.557 1116.17 559.981 1116.87 558.625C1117.56 557.269 1118.54 556.212 1119.81 555.455C1121.08 554.697 1122.57 554.318 1124.29 554.318C1125.44 554.318 1126.51 554.504 1127.5 554.875C1128.5 555.239 1129.37 555.788 1130.12 556.523C1130.87 557.258 1131.45 558.182 1131.87 559.295C1132.28 560.402 1132.49 561.697 1132.49 563.182V564.511H1117.75V561.511H1127.93C1127.93 560.814 1127.78 560.197 1127.48 559.659C1127.18 559.121 1126.76 558.701 1126.22 558.398C1125.69 558.087 1125.07 557.932 1124.37 557.932C1123.63 557.932 1122.98 558.102 1122.41 558.443C1121.85 558.777 1121.41 559.227 1121.09 559.795C1120.78 560.356 1120.61 560.981 1120.61 561.67V564.523C1120.61 565.386 1120.76 566.133 1121.08 566.761C1121.41 567.39 1121.87 567.875 1122.46 568.216C1123.05 568.557 1123.75 568.727 1124.56 568.727C1125.1 568.727 1125.59 568.652 1126.04 568.5C1126.48 568.348 1126.87 568.121 1127.18 567.818C1127.5 567.515 1127.75 567.144 1127.91 566.705L1132.39 567C1132.16 568.076 1131.7 569.015 1130.99 569.818C1130.29 570.614 1129.39 571.235 1128.29 571.682C1127.19 572.121 1125.92 572.341 1124.48 572.341ZM1144.93 554.545V558.182H1134.42V554.545H1144.93ZM1136.81 550.364H1141.65V566.636C1141.65 567.083 1141.72 567.432 1141.86 567.682C1141.99 567.924 1142.18 568.095 1142.42 568.193C1142.67 568.292 1142.96 568.341 1143.29 568.341C1143.51 568.341 1143.74 568.322 1143.97 568.284C1144.2 568.239 1144.37 568.205 1144.49 568.182L1145.25 571.784C1145.01 571.86 1144.67 571.947 1144.23 572.045C1143.79 572.152 1143.26 572.216 1142.63 572.239C1141.46 572.284 1140.44 572.129 1139.56 571.773C1138.69 571.417 1138.01 570.864 1137.53 570.114C1137.04 569.364 1136.8 568.417 1136.81 567.273V550.364Z" fill="white"/>
      <defs>
      <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
      <use xlink:href="#image0_0_1" transform="scale(0.00260417)"/>
      </pattern>
      <image id="image0_0_1" width="384" height="384" xlink:href="data:image/png;base64,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Bma0b/f+TLWt7xE7lLmhMc/96pX7X1zduG4OiH3n3h/2li0YkBEgICNAQEaAgIwAARmnYLDvTs9WC/gf3wcJEHtt6r05U+8VmuoXL7+2ld8zyQLmfcbYggEZAQIyAgRkBAjICBCQESAg4xgedm2pQz0bcB/QQhz6vT+H7rfvv73+Dy94rmcqn4CWw70/HBzPgICMAAEZAQIyAgRkBAjIOAWDuZj3uZQAwQST5n1OTk7M+1zMFgzICBCQESAgI0BARoCAjAABGcfwsK5vPHW6unter2JRBGjhps6tVJ7/zlPJ3512j8/dc3M922ULBmQECMgIEJARICAjQEBGgICMY/gl2819NIPfxnEQzPXkBGjh5p5bGfs+MnM9rMMWDMgIEJARICAjQEBGgICMAAEZx/DL4VuozPUcnGv3zm/Xa+AAjM377NUg4urGdXM9h8UnINa1P6FhMTwDAjICBGQECMgIEJARICDjFIzNmTziigSIKzF3w1XYggEZAQIyAgRkBAjICBCQESAg4xiedZn6YevcBwRkbMGAjAABGQECMgIEZAQIyAgQkBEgICNAQEaAgIwAARkBAjICBGQECMgIEJARICAjQEBGgICMAAEZAQIyAgRkBAjICBCQESAgI0BARoCAjAABGQECMgIEZAQIyAgQkBEgICNAQEaAgIwAARkBAjICBGQECMgIEJARICAjQEBGgICMAAEZAQIyAgRkBAjICBCQESAgI0BARoCAjAABGQECMv8JAAD//xK2+oDCsCEcAAAAAElFTkSuQmCC"/>
      </defs>
    </svg>
    `
  )

  const ogpImage = await sharp(svg).resize(1200, 630).png().toBuffer()
  const imagePath = path.join(root, '/public/ogp')
  if (!fs.existsSync(imagePath)) {
    fs.mkdirSync(imagePath)
  }
  fs.writeFileSync(path.join(root, `/public/ogp/${slug}.png`), ogpImage)
}
