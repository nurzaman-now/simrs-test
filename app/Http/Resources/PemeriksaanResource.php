<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PemeriksaanResource extends JsonResource
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
            'tanggal_kunjungan' => $this->created_at?->format('d F Y'),
            'pemberian_obat' => $this->whenLoaded('pemberianObat', function () {
                return PemberianObatResource::collection($this->resource->pemberianObat);
            }),
        ];
    }
}
