import { computed, ref } from 'vue'
import { CLOTHING_SIZE_SYSTEMS, getClothingSizeOptions, resolveClothingSize } from '../lib/calculations'
import type { ClothingSizeKey, ClothingSizeSystem } from '../types/clothingSize'

export function useClothingSizeConverter() {
  const system = ref<ClothingSizeSystem>('ru')
  const sizeKey = ref<ClothingSizeKey>('m')

  const options = computed(() => getClothingSizeOptions(system.value))
  const result = computed(() => resolveClothingSize(sizeKey.value))

  return {
    system,
    sizeKey,
    systems: CLOTHING_SIZE_SYSTEMS,
    options,
    result,
  }
}
