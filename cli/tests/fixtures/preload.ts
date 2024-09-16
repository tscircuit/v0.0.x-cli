import "bun-match-svg"
import { expect } from "bun:test"
import pcbStackup, { type Stackup } from "pcb-stackup"
import { Readable } from "stream"

async function toMatchGerberSnapshot(
  this: any,
  gerberOutput: Record<string, string>,
  testPathOriginal: string,
  svgName?: string,
) {
  // Create layers array from gerberOutput
  const layers = Object.entries(gerberOutput).map(([filename, content]) => ({
    filename,
    gerber: Readable.from(content),
  }))

  try {
    const stackup = await pcbStackup(layers)
    const svgArray: string[] = []
    const svgNames: string[] = []

    for (const item of Object.keys(stackup!) as Array<keyof Stackup>) {
      const layer = stackup[item] as { svg: string }
      if (layer.svg) {
        svgArray.push(layer.svg)
        svgNames.push(`${svgName}-${item}`)
      }
    }
    return expect(svgArray).toMatchMultipleSvgSnapshots(
      testPathOriginal,
      svgNames,
    )
  } catch (error) {
    throw new Error(`Failed to generate PCB stackup: ${error}`)
  }
}

expect.extend({
  // biome-ignore lint/suspicious/noExplicitAny:
  toMatchGerberSnapshot: toMatchGerberSnapshot as any,
})

declare module "bun:test" {
  interface Matchers<T = unknown> {
    /**
     * This doesn't currently work in bun, some bug in node:stream
     */
    toMatchGerberSnapshot(
      testImportMetaPath: string,
      svgName?: string,
    ): Promise<MatcherResult>
  }
}
