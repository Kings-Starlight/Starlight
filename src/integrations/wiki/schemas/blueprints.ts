import z from "zod";

// ----------------------------------------
// Shared modifier schemas
// ----------------------------------------

export const BlueprintModifierQualityRangeSchema = z.object({
  min: z.number().nullable().optional(),
  max: z.number().nullable().optional(),
});

export const BlueprintModifierRangeSchema = z.object({
  at_min_quality: z.number().nullable().optional(),
  at_max_quality: z.number().nullable().optional(),
});

export const BlueprintModifierSchema = z.object({
  property_key: z.string().optional(),
  property_uuid: z.string().nullable().optional(),
  label: z.string().optional(),
  better_when: z.enum(["higher", "lower", "neutral"]).nullable().optional(),
  quality_range: BlueprintModifierQualityRangeSchema.optional(),
  modifier_range: BlueprintModifierRangeSchema.optional(),
  value_range_type: z.enum(["linear"]).nullable().optional(),
  value_segments: z
    .array(
      z.object({
        quality_min: z.number().optional(),
        quality_max: z.number().optional(),
        modifier_at_start: z.number().optional(),
        modifier_at_end: z.number().optional(),
      }),
    )
    .nullable()
    .optional(),
});

// ----------------------------------------
// Blueprint output
// ----------------------------------------

export const BlueprintOutputSchema = z.object({
  uuid: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  class: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  type_label: z.string().nullable().optional(),
  sub_type: z.string().nullable().optional(),
  subtype: z.string().nullable().optional(),
  grade: z.string().nullable().optional(),
  item_web_url: z.string().nullable().optional(),
});

// ----------------------------------------
// Blueprint ingredients
// ----------------------------------------

export const BlueprintIngredientSchema = z.object({
  name: z.string().nullable().optional(),
  kind: z.enum(["resource", "item"]).nullable().optional(),
  resource_type_uuid: z.string().nullable().optional(),
  item_uuid: z.string().nullable().optional(),
  quantity_scu: z.number().nullable().optional(),
  quantity: z.number().nullable().optional(),
  link: z.string().nullable().optional(),
  web_url: z.string().nullable().optional(),
});

export const BlueprintDismantleReturnSummarySchema = z.object({
  name: z.string().nullable().optional(),
  resource_type_uuid: z.string().nullable().optional(),
  quantity_scu: z.number().nullable().optional(),
  link: z.string().nullable().optional(),
  web_url: z.string().nullable().optional(),
});

export const BlueprintDismantleSchema = z.object({
  time_seconds: z.number().nullable().optional(),
  time_label: z.string().nullable().optional(),
  efficiency: z.number().nullable().optional(),
});

// ----------------------------------------
// Requirement tree
// ----------------------------------------

export const BlueprintRequirementChildSchema: z.ZodType<{
  key?: string | null;
  kind?: "group" | "resource" | "item" | null;
  uuid?: string | null;
  name?: string | null;
  required_count?: number | null;
  quantity?: number | null;
  quantity_scu?: number | null;
  min_quality?: number | null;
  modifiers?: z.infer<typeof BlueprintModifierSchema>[];
  children?: z.infer<typeof BlueprintRequirementChildSchema>[] | null;
}> = z.lazy(() =>
  z.object({
    key: z.string().nullable().optional(),
    kind: z.enum(["group", "resource", "item"]).nullable().optional(),
    uuid: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
    required_count: z.number().nullable().optional(),
    quantity: z.number().nullable().optional(),
    quantity_scu: z.number().nullable().optional(),
    min_quality: z.number().nullable().optional(),
    modifiers: z.array(BlueprintModifierSchema).optional(),
    children: z.array(BlueprintRequirementChildSchema).nullable().optional(),
  }),
);

export const BlueprintRequirementGroupSchema = z.object({
  key: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  kind: z.enum(["group"]).optional(),
  required_count: z.number().nullable().optional(),
  modifiers: z.array(BlueprintModifierSchema).optional(),
  children: z.array(BlueprintRequirementChildSchema).optional(),
});

export const BlueprintRequirementNodeSchema: z.ZodType<{
  kind?: "root" | "group" | "resource" | "item" | null;
  key?: string | null;
  name?: string | null;
  uuid?: string | null;
  required_count?: number | null;
  quantity?: number | null;
  quantity_scu?: number | null;
  min_quality?: number | null;
  modifiers?: z.infer<typeof BlueprintModifierSchema>[] | null;
  children?: z.infer<typeof BlueprintRequirementNodeSchema>[] | null;
}> = z.lazy(() =>
  z.object({
    kind: z.enum(["root", "group", "resource", "item"]).nullable().optional(),
    key: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
    uuid: z.string().nullable().optional(),
    required_count: z.number().nullable().optional(),
    quantity: z.number().nullable().optional(),
    quantity_scu: z.number().nullable().optional(),
    min_quality: z.number().nullable().optional(),
    modifiers: z.array(BlueprintModifierSchema).nullable().optional(),
    children: z.array(BlueprintRequirementNodeSchema).nullable().optional(),
  }),
);

// ----------------------------------------
// Blueprint tiers
// ----------------------------------------

export const BlueprintTierSchema = z.object({
  tier_index: z.number().nullable().optional(),
  craft_time_seconds: z.number().nullable().optional(),
  requirements: BlueprintRequirementNodeSchema.nullable().optional(),
});

// ----------------------------------------
// Blueprint summary properties
// ----------------------------------------

export const BlueprintSummaryPropertySchema = z.object({
  property_key: z.string().optional(),
  property_uuid: z.string().nullable().optional(),
  label: z.string().optional(),
  better_when: z.enum(["higher", "lower", "neutral"]).nullable().optional(),
});

// ----------------------------------------
// Unlocking missions
// ----------------------------------------

export const BlueprintUnlockingMissionSchema = z.object({
  title: z.string().nullable().optional(),
  debug_name: z.string().nullable().optional(),
  reward_scope: z.string().nullable().optional(),
  chance: z.number().nullable().optional(),
  web_url: z.string().nullable().optional(),
});

export const BlueprintUnlockingMissionsGroupedEntrySchema = z.object({
  title: z.string().optional(),
  reward_scope: z.string().nullable().optional(),
  count: z.number().optional(),
  web_url: z.string().nullable().optional(),
});

export const BlueprintUnlockingMissionsGroupedSchema = z.object({
  label: z.string().optional(),
  chance: z.number().nullable().optional(),
  missions: z.array(BlueprintUnlockingMissionsGroupedEntrySchema).optional(),
});

// ----------------------------------------
// Blueprint aspects
// ----------------------------------------

export const BlueprintAspectInputSchema = z.object({
  kind: z.string().optional(),
  uuid: z.string().nullable().optional(),
  name: z.string().optional(),
  quantity: z.number().nullable().optional(),
  quantity_scu: z.number().nullable().optional(),
  min_quality: z.number().optional(),
  web_url: z.string().nullable().optional(),
});

export const BlueprintAspectSelectionGroupSchema = z.object({
  key: z.string().optional(),
  name: z.string().optional(),
  required_count: z.number().optional(),
  option_count: z.number().optional(),
});

export const BlueprintAspectSchema = z.object({
  key: z.string().optional(),
  name: z.string().optional(),
  required_count: z.number().nullable().optional(),
  selection_group: BlueprintAspectSelectionGroupSchema.nullable().optional(),
  input: BlueprintAspectInputSchema.optional(),
  modifiers: z.array(BlueprintModifierSchema).optional(),
  initial_quality: z.number().optional(),
  slider_min: z.number().optional(),
  slider_max: z.number().optional(),
  has_modifiers: z.boolean().optional(),
  has_dynamic_modifiers: z.boolean().optional(),
  is_selected: z.boolean().optional(),
});

export const BlueprintAspectGroupSchema = z.object({
  key: z.string().optional(),
  name: z.string().optional(),
  display_name: z.string().nullable().optional(),
  required_count: z.number().optional(),
  option_count: z.number().optional(),
  is_choice_group: z.boolean().optional(),
  selected_count: z.number().optional(),
  aspect_indexes: z.array(z.number()).optional(),
});

export const BlueprintAspectsSchema = z.object({
  aspects: z.array(BlueprintAspectSchema).optional(),
  aspect_groups: z.array(BlueprintAspectGroupSchema).optional(),
  has_interactive_aspects: z.boolean().optional(),
});

// ----------------------------------------
// Main blueprint schema
// ----------------------------------------

export const BlueprintSchema = z.object({
  uuid: z.string().optional(),
  key: z.string().optional(),
  category_uuid: z.string().optional(),
  output_item_uuid: z.string().optional(),
  output_name: z.string().nullable().optional(),
  output_class: z.string().nullable().optional(),
  craft_time_seconds: z.number().nullable().optional(),
  craft_time_label: z.string().nullable().optional(),
  is_available_by_default: z.boolean().optional(),
  game_version: z.string().nullable().optional(),
  ingredient_count: z.number().optional(),
  unlocking_missions_count: z.number().optional(),
  ingredients: z.array(BlueprintIngredientSchema).optional(),
  dismantle_returns: z.array(BlueprintDismantleReturnSummarySchema).optional(),
  output: BlueprintOutputSchema.optional(),
  dismantle: BlueprintDismantleSchema.optional(),
  requirement_groups: z.array(BlueprintRequirementGroupSchema).optional(),
  summary_properties: z.array(BlueprintSummaryPropertySchema).optional(),
  unlocking_missions: z.array(BlueprintUnlockingMissionSchema).optional(),
  unlocking_missions_grouped: z.array(BlueprintUnlockingMissionsGroupedSchema).optional(),
  aspects: BlueprintAspectsSchema.optional(),
  tiers: z.array(BlueprintTierSchema).optional(),
  link: z.string().optional(),
  web_url: z.string().optional(),
  output_item_web_url: z.string().nullable().optional(),
});

export type Blueprint = z.infer<typeof BlueprintSchema>;
