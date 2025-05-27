<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PasienResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            ...parent::toArray($request),
            'tanggal_lahir' => $this->resource->tanggal_lahir?->format('d F Y'),
            'pemeriksaan' => $this->resource->relationLoaded('pemeriksaan')
                ? PemeriksaanResource::collection($this->resource->pemeriksaan)
                : null,
        ];
    }
}
