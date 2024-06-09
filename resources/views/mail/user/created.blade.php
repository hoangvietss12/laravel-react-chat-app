<x-mail::message>
    Xin chào, {{$user->name}}

    Tài khoản của bạn đã được tạo thành công.

    Dưới đây là thông tin đăng nhập cho tài khoản của bạn:
    - Email: {{$user->email}}
    - Mật khẩu: {{$password}}

    Vui lòng đăng nhập và thay đổi mật khẩu của bạn.

    <x-mail::button url="{{route('login')}}">
        Nhấn vào đây để đăng nhập
    </x-mail::button>

    Cảm ơn, <br>
    {{config('app.name')}}
</x-mail::message>
